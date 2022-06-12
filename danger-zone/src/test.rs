use super::*;

use near_sdk::test_utils::VMContextBuilder;
use near_sdk::{testing_env, VMContext};
use std::time::{SystemTime, UNIX_EPOCH};

struct ContextSetup {
    is_view: bool,
    balance: Option<Balance>,
    deposit: Option<Balance>,
}

fn get_context(setup: &ContextSetup) -> VMContext {
    let base_account = "unicorn.near".to_owned();
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

fn get_non_empty_contract() -> Contract {
    let mut contract = Contract {
        tasks: UnorderedMap::<String, Task>::new(b"t"),
        user_profile: LookupMap::<AccountId, UserInfo>::new(b"u"),
    };

    let orderer = AccountId::try_from("unicorn.near".to_string()).unwrap();
    let key = "unicorn.near1507";

    println!("inserting to contract");
    contract.tasks.insert(
        &key.to_owned(),
        &Task {
            orderer: orderer.to_owned(),
            performer: Some(AccountId::try_from("horner.near".to_string()).unwrap()),
            title: "awesome title".to_string(),
            description: "awesome description".to_string(),
            reward: 10,
            category: TaskCategories::Development,
            deadline: 14124124,
            status: TaskStatus::Created,
            result_comment: Some("awesome comment".to_string()),
        },
    );

    contract.user_profile.insert(
        &orderer.to_owned(),
        &UserInfo {
            order_tasks_id: vec![key.to_string()],
            perform_tasks_id: vec![],
            is_busy: true,
        },
    );

    return contract;
}

fn get_empty_contract() -> Contract {
    Contract {
        tasks: UnorderedMap::<String, Task>::new(b"t"),
        user_profile: LookupMap::<AccountId, UserInfo>::new(b"u"),
    }
}

#[test]
fn get_tasks() {
    testing_env!(get_context(&ContextSetup {
        is_view: true,
        balance: None,
        deposit: None,
    }));

    let contract = get_empty_contract();

    let tasks = contract.get_tasks();
    println!("got tasks: {:?}", tasks);

    assert!(tasks.len() == 0)
}

#[test]
fn get_empty_users_tasks_info() {
    testing_env!(get_context(&ContextSetup {
        is_view: false,
        balance: None,
        deposit: None,
    }));

    let contract = get_empty_contract();
    let user_info =
        contract.get_users_tasks_info(AccountId::try_from("unicorn.near".to_owned()).unwrap());
    println!("user info: {:?}", user_info);

    // it is OK if user_info is empty - it is case when user don't have any tasks ordered or performed yet
    assert!(user_info.is_none());
}

#[test]
fn get_non_empty_users_tasks_info() {
    testing_env!(get_context(&ContextSetup {
        is_view: false, // needed to preset some info in get_non_empty_contract() func
        balance: None,
        deposit: None,
    }));

    let contract = get_non_empty_contract();

    let user_info =
        contract.get_users_tasks_info(AccountId::try_from("unicorn.near".to_owned()).unwrap());
    println!("user info: {:?}", user_info);

    assert!(user_info.is_some());
}

#[test]
fn create_task() {
    testing_env!(get_context(&ContextSetup {
        is_view: false,
        balance: None,
        deposit: None,
    }));

    let mut contract = get_empty_contract();

    let tasks_before = contract.get_tasks();
    println!("tasks before: {:?}", tasks_before);

    contract.create_task(
        "awesome_task".to_owned(),
        "awesome_description".to_owned(),
        "Researching".to_owned(),
        93234273,
    );

    let tasks_after = contract.get_tasks();

    println!("tasks after: {:?}", tasks_after);

    assert!(tasks_after.len() > tasks_before.len())
}
