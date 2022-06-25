use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::AccountId;

use crate::def_enum::{TaskCategories, TaskStatus};

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Task {
    pub orderer: AccountId,
    pub performer: Option<AccountId>,

    pub title: String,
    pub description: String,

    pub reward: U128,
    pub category: TaskCategories,
    pub deadline: u64, // unix timestamp, generated on frontend
    pub status: TaskStatus,
    pub result_comment: Option<String>, // value that orderer set after confirmation of the task completion
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct UserInfo {
    pub order_tasks_id: Vec<String>,
    pub perform_tasks_id: Vec<String>,
    pub is_busy: bool,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct FilterValues {
    pub task_id: String,
    pub status: String,
    pub category: String,
    pub orderer: String,
    pub performer: String,
    pub max_deadline: u64,
    pub reward_min: U128,
    pub reward_max: U128,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Pagination {
    pub from_index: usize,
    pub limit: usize,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct ResponseWithPagination {
    pub filtered_tasks: Vec<(String, Task)>,
    pub total_size: usize,
}
