use near_sdk::ONE_NEAR;

use crate::test::*;

fn default_setup() -> Contract {
    testing_env!(get_context(ContextSetup {
        is_view: false,
        balance: None,
        deposit: None,
    }));

    let contract = get_non_empty_contract(ContractSetup {
        setup_users_profile: true,
        is_user_busy: false,
        rewrite_default_orderer: None,
        optional_performer: None,
    });

    println!("generated tasks: {:#?}", contract.get_tasks());

    return contract;
}

#[test]
fn normal_case() {
    let contract = default_setup();
    let tasks = contract.filter_tasks(
        &String::from(""),
        &String::from(""),
        &String::from(""),
        &String::from(""),
        &String::from(""),
        0,
        (ONE_NEAR * 0u128).into(),
        (ONE_NEAR * 100u128).into(),
    );
    println!("got tasks: {:?}", tasks);
    assert!(tasks.len() == 1)
}

#[test]
fn reward_min_invalid() {
    let contract = default_setup();
    let tasks = contract.filter_tasks(
        &String::from(""),
        &String::from(""),
        &String::from(""),
        &String::from(""),
        &String::from(""),
        0,
        (ONE_NEAR * 11u128).into(),
        (ONE_NEAR * 100u128).into(),
    );
    println!("got tasks: {:?}", tasks);

    // assert!(tasks.len() == 1)
}

#[test]
fn status_invalid() {
    let contract = default_setup();
    let tasks = contract.filter_tasks(
        &String::from(""),
        &String::from("inprogress"),
        &String::from(""),
        &String::from(""),
        &String::from(""),
        0,
        (ONE_NEAR * 0u128).into(),
        (ONE_NEAR * 100u128).into(),
    );
    println!("got tasks: {:?}", tasks);
    assert!(tasks.len() == 0)
}

#[test]
#[should_panic]
fn wrong_category_critical_invalid() {
    let contract = default_setup();
    let tasks = contract.filter_tasks(
        &String::from(""),
        &String::from(""),
        &String::from("bunch_of_lemons"),
        &String::from(""),
        &String::from(""),
        0,
        (ONE_NEAR * 0u128).into(),
        (ONE_NEAR * 100u128).into(),
    );
    println!("got tasks: {:?}", tasks);
}

#[test]
#[should_panic]
fn reward_max_valid_and_performer_critical_invalid() {
    let contract = default_setup();
    contract.filter_tasks(
        &String::from(""),
        &String::from(""),
        &String::from(""),
        &String::from(""),
        &String::from("just an awesome guy"),
        0,
        0u128.into(),
        100u128.into(),
    );
}

#[test]
fn orderer_valid_and_task_id_invalid() {
    let contract = default_setup();
    let tasks = contract.filter_tasks(
        &String::from(""),
        &String::from(""),
        &String::from(""),
        &String::from(ORDERER),
        &String::from(""),
        0,
        0u128.into(),
        100u128.into(),
    );
    println!("got tasks: {:?}", tasks);
    assert!(tasks.len() == 0)
}
