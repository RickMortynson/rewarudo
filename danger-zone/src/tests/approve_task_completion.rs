use crate::test::*;

#[test]
fn normal_case() {
    testing_env!(get_context(ContextSetup {
        is_view: false,
        balance: None,
        deposit: None
    }));

    let this_user = env::signer_account_id();
    let performer = AccountId::try_from(TEST_USER.to_owned()).unwrap();

    let mut contract = get_non_empty_contract(ContractSetup {
        setup_users_profile: true,
        is_user_busy: true,
        rewrite_default_orderer: Some(this_user.clone()),
        optional_performer: Some(performer.clone()),
    });

    let task_id = format!("{}{}", this_user.clone(), SAMPLE_TASK_PREFIX);

    // explicitly add task to performer' perform_tasks_id array
    // make it this way because only performer itself can call take_task method
    // but current test env user is an orderer
    let mut performer_profile = contract.users_profile.get(&performer).unwrap();
    performer_profile.perform_tasks_id.push(task_id.clone());
    contract.users_profile.insert(&performer, &performer_profile);

    contract.approve_task_completion(&task_id, &"good job fella".to_owned());

    assert!(contract.get_tasks()[0].1.result_comment.is_some());

    let performer_info = contract.get_users_tasks_info(performer).unwrap();
    assert!(performer_info.is_busy == false);
    assert!(performer_info.perform_tasks_id[0] == task_id);
}
