use crate::test::*;

fn call_take_task_and_debug(mut contract: Contract, inserted_task_id: &str) -> Contract {
    println!("tasks before: {:?}", contract.get_tasks());
    println!(
        "users_profile before: {:?}",
        contract.get_users_tasks_info(env::signer_account_id())
    );

    contract.take_task(&inserted_task_id.to_owned());

    println!("tasks after: {:?}", contract.get_tasks());
    println!(
        "users_profile after: {:?}",
        contract.get_users_tasks_info(env::signer_account_id())
    );

    return contract;
}

#[test]
fn normal_case() {
    testing_env!(get_context(ContextSetup {
        is_view: false,
        balance: None,
        deposit: None,
    }));

    let mut contract = get_non_empty_contract(ContractSetup {
        setup_users_profile: false,
        is_user_busy: false,
        rewrite_default_orderer: None,
        optional_performer: None,
    });

    let inserted_task_id = format!("{}{}", ORDERER, SAMPLE_TASK_PREFIX);

    contract = call_take_task_and_debug(contract, &*inserted_task_id);

    let task = &contract.get_tasks()[0];

    assert_eq!(
        task.1.performer.as_ref().unwrap(),
        &env::signer_account_id()
    );
}

#[test]
#[should_panic]
fn case_user_busy() {
    testing_env!(get_context(ContextSetup {
        is_view: false,
        balance: None,
        deposit: None,
    }));

    let contract = get_non_empty_contract(ContractSetup {
        setup_users_profile: true,
        is_user_busy: true,
        rewrite_default_orderer: None,
        optional_performer: Some(env::signer_account_id()),
    });

    let inserted_task_id = format!("{}{}", ORDERER, SAMPLE_TASK_PREFIX);

    call_take_task_and_debug(contract, &*inserted_task_id);
}

#[test]
#[should_panic]
fn case_caller_is_orderer() {
    testing_env!(get_context(ContextSetup {
        is_view: false,
        balance: None,
        deposit: None
    }));

    let this_user = env::signer_account_id();

    let contract = get_non_empty_contract(ContractSetup {
        setup_users_profile: false,
        is_user_busy: false,
        rewrite_default_orderer: Some(this_user.clone()),
        optional_performer: None,
    });

    let inserted_task_id = format!("{}{}", this_user.as_str(), SAMPLE_TASK_PREFIX);
    call_take_task_and_debug(contract, inserted_task_id.as_str());
}
