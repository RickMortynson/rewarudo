use super::*;

pub fn string_to_category_enum(category_arg: String) -> TaskCategories {
    match category_arg.to_lowercase().as_str() {
        "development" => TaskCategories::Development,
        "design" => TaskCategories::Design,
        "writing" => TaskCategories::Writing,
        "researching" => TaskCategories::Researching,
        "typing" => TaskCategories::Typing,
        "mentoring" => TaskCategories::Mentoring,
        _ => panic!("invalid task category"),
    }
}

#[near_bindgen]
impl Contract {
    pub(super) fn insert_task_to_user_info(
        &mut self,
        user_key: &AccountId,
        task_relation: UserTaskRelation,
        task_id: &String,
    ) {
        match self.users_profile.get(&user_key) {
            Some(mut user) => match task_relation {
                UserTaskRelation::Orderer => {
                    user.order_tasks_id.push(task_id.to_string());
                    self.users_profile.insert(&user_key, &user);
                }
                UserTaskRelation::Performer => {
                    user.perform_tasks_id.push(task_id.to_string());
                    user.is_busy = true;
                    self.users_profile.insert(&user_key, &user);
                }
            },
            None => {
                self.init_empty_user_info(user_key);
                self.insert_task_to_user_info(user_key, task_relation, task_id);
            }
        };
        return ();
    }

    pub(super) fn init_empty_user_info(&mut self, user_key: &AccountId) {
        self.users_profile.insert(
            &user_key,
            &UserInfo {
                order_tasks_id: Vec::<String>::new(),
                perform_tasks_id: Vec::<String>::new(),
                is_busy: false,
            },
        );
    }
}
