#[path = "definitions/def_enum.rs"]
mod def_enum;
#[path = "definitions/def_struct.rs"]
mod def_struct;
mod helper;

#[cfg(all(test, not(target_arch = "wasm32")))]
#[path = "tests/base.rs"]
mod test;

use crate::def_enum::{TaskCategories, TaskStatus, UserTaskRelation};
use crate::def_struct::{FilterValues, Pagination, ResponseWithPagination, Task, UserInfo};
use crate::helper::enum_eq;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::json_types::U128;
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    // Unordered map instead of Vector for the case when the user wants to get the value by id from data structure.
    // In this implementation, it won't check every single value in Vector - Task id is a key of the UnorderedMap
    tasks: UnorderedMap<String, Task>,
    users_profile: LookupMap<AccountId, UserInfo>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Contract {
            tasks: UnorderedMap::<String, Task>::new(b"t"),
            users_profile: LookupMap::<AccountId, UserInfo>::new(b"u"),
        }
    }

    pub fn get_tasks(&self) -> Vec<(String, Task)> {
        return self.tasks.to_vec();
    }

    pub fn get_tasks_by_id(&self, id_vec_to_get: Vec<String>) -> Vec<(String, Task)> {
        return self
            .tasks
            .iter()
            .filter(|(task_id, _)| id_vec_to_get.contains(task_id))
            .collect();
    }

    pub fn get_users_tasks_info(&self, user_id: AccountId) -> Option<UserInfo> {
        return self.users_profile.get(&user_id);
    }

    #[payable]
    pub fn create_task(
        &mut self,
        title: String,
        description: String,
        category_arg: &String,
        deadline: u64,
    ) -> String {
        // get reward, orderer from metadata, category as enum from argument
        let reward: U128 = U128::from(env::attached_deposit());
        let this_user = env::signer_account_id();

        let task: Task = Task {
            orderer: this_user.clone(),
            performer: None, // unknown for now

            title,
            description,

            reward,
            category: TaskCategories::from(category_arg),
            deadline,
            status: TaskStatus::Created,
            result_comment: None,
        };

        // pseudo-unique id. I assume that one user at one point of time will create at most 1 task
        let task_id = format!("{}{}", &this_user, env::block_timestamp());

        self.tasks.insert(&task_id, &task);

        // add to a vector self.users_profile[this_user].order_tasks_id new order's Id
        self.insert_task_to_user_info(&this_user, UserTaskRelation::Orderer, &task_id);

        return task_id;
    }

    pub fn take_task(&mut self, task_id: &String) {
        let this_user = env::signer_account_id();
        match self.users_profile.get(&this_user) {
            Some(user) => {
                if user.is_busy {
                    env::panic_str("the user already have an active task");
                }
                // take task, panic if it does not exists
                // also panic if the field 'orderer' of the task equals to id of the method caller
                let mut task = self.tasks.get(&task_id).unwrap();
                if task.orderer == this_user {
                    env::panic_str("the orderer can not perform their own orders");
                }

                task.status = TaskStatus::InProgress;
                task.performer = Some(this_user.clone());

                // update old task & swap updated value with an old one
                self.tasks.insert(&task_id, &task);

                // add to a vector self.users_profile[this_user].perform_tasks_id new order's Id
                self.insert_task_to_user_info(&this_user, UserTaskRelation::Performer, task_id);
            }
            None => {
                // initialize empty value for this user in self.users_profile
                // then call this method again
                self.init_empty_user_info(&this_user);
                self.take_task(task_id);
            }
        }
    }

    pub fn approve_task_completion(&mut self, task_id: &String, result_comment: &String) {
        // get old task, panic if there is no entry in tasks UnorderedMap with this key
        let mut task = self.tasks.get(task_id).unwrap();

        // only orderer can approve task completion
        assert_eq!(env::signer_account_id(), task.orderer);

        // update task fields
        task.status = TaskStatus::Done;
        task.result_comment = Some(result_comment.to_owned());

        // get old performer profile id, panic if it does not exist
        let performer_id = task.performer.as_ref().unwrap();

        // swap old task with updated one
        self.tasks.insert(task_id, &task);

        if task.reward > U128::from(0) {
            Promise::new(performer_id.to_owned()).transfer(task.reward.0);
        }

        // get performer profile and update it
        let mut performer_profile = self.users_profile.get(performer_id).unwrap();
        performer_profile.is_busy = false;

        // swap old performer profile with updated one
        self.users_profile.insert(performer_id, &performer_profile);
    }

    /// filter_tasks gets filter & pagination preferences
    /// then filters whole self.tasks and after that - shrinks result array to the pagination limits
    #[deprecated(
        note = "Attention: horrible approach. Don't use this in production. Consider using a third-party service for filtering and pagination"
    )]
    pub fn filter_tasks(
        &self,
        filter: FilterValues,
        pagination: Pagination,
    ) -> ResponseWithPagination {
        let filtered_tasks: Vec<(String, Task)> = self
            .tasks
            .iter()
            .filter(|(_, task)| {
                return (filter.orderer == "" || filter.orderer == task.orderer.as_str())
                    && (filter.category == ""
                        || enum_eq(
                            &task.category,
                            &TaskCategories::from(&filter.category),
                        ))
                    && (filter.status == ""
                        || enum_eq(&task.status, &TaskStatus::from(&filter.status)))
                    && (filter.performer == ""
                        || filter.performer
                            == task
                                .performer
                                .as_ref()
                                .unwrap_or(&"".parse::<AccountId>().unwrap())
                                .as_str())
                    && (filter.max_deadline == 0 || filter.max_deadline > task.deadline)
                    && (filter.reward_min <= task.reward)
                    && (filter.reward_max >= task.reward);
            })
            .collect();

        let pages_to_return = (pagination.from_index
            ..std::cmp::min(
                pagination.from_index + pagination.limit,
                filtered_tasks.len(),
            ))
            .map(|index| filtered_tasks.get(index).unwrap().clone())
            .collect();

        ResponseWithPagination {
            filtered_tasks: pages_to_return,
            total_size: filtered_tasks.len(),
        }
    }
}
