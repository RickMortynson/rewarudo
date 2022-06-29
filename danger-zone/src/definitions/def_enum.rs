use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

trait EnumTrait {
    fn from_string(_: &String) -> Self;
}

// list of available categories for filtration in UI (tags)
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum TaskCategories {
    Development,
    Design,
    Writing,
    Researching,
    Typing,
    Mentoring,
}

impl From<&String> for TaskCategories {
    fn from(category_as_str: &String) -> Self {
        match category_as_str.to_lowercase().as_str() {
            "development" => TaskCategories::Development,
            "design" => TaskCategories::Design,
            "writing" => TaskCategories::Writing,
            "researching" => TaskCategories::Researching,
            "typing" => TaskCategories::Typing,
            "mentoring" => TaskCategories::Mentoring,
            _ => panic!("invalid task category"),
        }
    }
}

// list of possible tasks statuses for filtration in UI (tags)
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum TaskStatus {
    Created,
    InProgress,
    Done,
}

impl From<&String> for TaskStatus {
    fn from(status_as_str: &String) -> Self {
        match status_as_str.to_lowercase().as_str() {
            "development" => TaskStatus::Created,
            "inprogress" => TaskStatus::InProgress,
            "done" => TaskStatus::Done,
            _ => panic!("invalid task status"),
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub enum UserTaskRelation {
    Orderer,
    Performer,
}
