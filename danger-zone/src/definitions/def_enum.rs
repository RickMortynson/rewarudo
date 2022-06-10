use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

// list of available categories for filtration in UI (tags)
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum TaskCategories {
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
pub enum TaskStatus {
    Created,
    InProgress,
    Done,
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub enum UserTaskRelation {
  Orderer,
  Performer,
}