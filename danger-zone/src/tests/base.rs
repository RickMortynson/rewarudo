use super::*;

use near_sdk::test_utils::VMContextBuilder;
use near_sdk::{testing_env, Balance, VMContext};

use std::time::{SystemTime, UNIX_EPOCH};

mod approve_task_completion;
mod create_task;
mod filter_tasks;
mod get_tasks;
mod get_users_tasks_info;
mod take_task;

struct ContextSetup {
    is_view: bool,
    balance: Option<Balance>,
    deposit: Option<Balance>,
}

struct ContractSetup {
    setup_users_profile: bool,
    is_user_busy: bool,
    rewrite_default_orderer: Option<AccountId>,
    optional_performer: Option<AccountId>,
}

const TEST_USER: &'static str = "unicorn.near";
const ORDERER: &'static str = "orderer.near";
const SAMPLE_TASK_PREFIX: &'static str = "1507";

fn get_context(setup: ContextSetup) -> VMContext {
    let base_account = TEST_USER.to_owned();
    let current_time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    VMContextBuilder::new()
        .block_timestamp(current_time)
        .signer_account_id(base_account.try_into().unwrap())
        .account_balance(setup.balance.unwrap_or(0))
        .attached_deposit(setup.deposit.unwrap_or(0))
        .is_view(setup.is_view)
        .build()
}

fn get_empty_contract() -> Contract {
    Contract {
        tasks: UnorderedMap::<String, Task>::new(b"t"),
        users_profile: LookupMap::<AccountId, UserInfo>::new(b"u"),
    }
}

/// do not forget to make `get_context` mutable: `ContextSetup{is_view: false}`
fn get_non_empty_contract(setup: ContractSetup) -> Contract {
    let mut contract = get_empty_contract();

    let orderer = setup
        .rewrite_default_orderer
        .unwrap_or(ORDERER.parse().unwrap());

    let inserted_task_id = format!("{}{}", orderer.as_str(), SAMPLE_TASK_PREFIX);

    contract.tasks.insert(
        &inserted_task_id.to_owned(),
        &Task {
            orderer: orderer.to_owned(),

            performer: setup.optional_performer,
            title: "awesome title".to_string(),
            description: "awesome description".to_string(),
            reward: U128::from(10 * 10u128.pow(24)), // 10 near
            category: TaskCategories::Development,
            deadline: 14124124,
            status: TaskStatus::Created,
            result_comment: Some("awesome comment".to_string()),
        },
    );

    if setup.setup_users_profile {
        contract.users_profile.insert(
            // performer - same user that will call test methods
            &AccountId::try_from(TEST_USER.to_owned()).unwrap(),
            &UserInfo {
                order_tasks_id: vec![inserted_task_id.to_string()],
                perform_tasks_id: vec![],
                is_busy: setup.is_user_busy,
            },
        );
    }

    return contract;
}
