use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Balance};

#[cfg(test)]
mod test;

// list of available categories for filtration in UI (tags)
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
enum TaskCategories {
    Development,
    Design,
    Writing,
    Researching,
    Typing,
    Mentoring,
}

// list of possible tasks statuses for filtration in UI (tags)
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
enum TaskStatus {
    Created,
    InProgress,
    Done,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Task {
    orderer: AccountId,
    performer: Option<AccountId>, // Optional value, when new task is creating, performer is unknown
    reward: u128,                 // yoctoNEAR value, 10⁻²⁴
    category: TaskCategories,
    deadline: u64, // unix timestamp, generated on frontend
    status: TaskStatus,
    result_comment: Option<String>, // value that orderer set after confirmation of the task completion
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    // Unordered map instead of Vector for the case when the user wants to get the value by id from data structure.
    // In this implementation, it won't check every single value in Vector - Task id is a key of the UnorderedMap
    tasks: UnorderedMap<String, Task>,
}

impl Default for Contract {
    fn default() -> Self {
        env::panic_str("The contract should be initialized before usage")
    }
}

// translate frontend' category to enum value
// I don't like this thing btw, review please
fn get_category_enum(category_arg: &str) -> TaskCategories {
    match category_arg {
        "Development" => TaskCategories::Development,
        "Design" => TaskCategories::Design,
        "Writing" => TaskCategories::Writing,
        "Researching" => TaskCategories::Researching,
        "Typing" => TaskCategories::Typing,
        "Mentoring" => TaskCategories::Mentoring,
        _ => env::panic_str("Invalid category"),
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        assert!(!env::state_exists(), "Already initialized");

        Contract {
            tasks: UnorderedMap::<String, Task>::new(b"U"),
        }
    }

    // TODO: add limitations
    pub fn get_tasks(&self) -> Vec<(String, Task)> {
        return self.tasks.to_vec();
    }

    #[payable]
    pub fn create_task(&mut self, category_arg: String, deadline: u64) -> String {
        // TODO: store funds somewhere
        let reward: Balance = env::attached_deposit();
        let category = get_category_enum(category_arg.as_str());
        let orderer = env::signer_account_id();

        let task: Task = Task {
            orderer: orderer.clone(),
            performer: None,
            reward,
            category,
            deadline,
            status: TaskStatus::Created,
            result_comment: None,
        };

        // pseudo-unique id. I assume that one user at one point of time will create at most 1 task
        let task_id = format!("{}{}", orderer, env::block_timestamp_ms());

        self.tasks.insert(&task_id, &task);

        return task_id;
    }

    pub fn get_users_ordered_tasks(&self, user_id: AccountId) -> Vec<(String, Task)> {
        let mut ordered = UnorderedMap::<String, Task>::new(b"T");

        for (id, task) in self.tasks.iter() {
            if task.orderer == user_id {
                ordered.insert(&id, &task);
            }
        }
        return ordered.to_vec();
    }

    pub fn get_users_perform_tasks(&self, user_id: AccountId) -> Vec<(String, Task)> {
        let mut performed = UnorderedMap::<String, Task>::new(b"T");

        // review pls, prbly there is a better way to handle optional value existence?
        for (id, task) in self.tasks.iter() {
            match task.performer {
                Some(ref performer) => {
                    if performer == &user_id {
                        performed.insert(&id, &task);
                    }
                }
                None => continue,
            }
        }
        return performed.to_vec();
    }

    pub fn take_task(&mut self, task_id: String) {
        // we assume that user select existing task id in ui
        let this_user = env::signer_account_id();
        match self.tasks.get(&task_id) {
            Some(mut task) => {
                if env::signer_account_id() == task.orderer {
                    env::panic_str("orderer can not perform theirs order");
                }
                task.performer = Some(this_user);
                //
                // swap old value with updated one, with new task.performer
                self.tasks.insert(&task_id, &task);
            }
            None => env::panic_str(format!("error: task with this id does not exist").as_str()),
        }
    }
}
