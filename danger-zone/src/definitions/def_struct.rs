use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::AccountId;

use crate::def_enum::{TaskCategories, TaskStatus};

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Task {
    pub orderer: AccountId,
    pub performer: Option<AccountId>,

    pub title: String,
    pub description: String,

    pub reward: u128, // yoctoNEAR value, 10⁻²⁴
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
