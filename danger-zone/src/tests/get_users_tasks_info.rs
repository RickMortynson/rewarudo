use crate::test::*;

#[test]
fn empty_contract() {
    testing_env!(get_context(ContextSetup {
        is_view: false,
        balance: None,
        deposit: None,
    }));

    let contract = get_empty_contract();
    let user_info =
        contract.get_users_tasks_info(AccountId::try_from(TEST_USER.to_owned()).unwrap());
    println!("user info: {:?}", user_info);

    // it is OK if user_info is empty - it is case when user don't have any tasks ordered or performed yet
    assert!(user_info.is_none());
}

#[test]
fn non_empty_contract() {
    testing_env!(get_context(ContextSetup {
        is_view: false, // needed to preset some info in get_non_empty_contract() func
        balance: None,
        deposit: None,
    }));

    let contract = get_non_empty_contract(ContractSetup {
        setup_users_profile: true,
        is_user_busy: false,
        rewrite_default_orderer: None, // default orderer
        optional_performer: None,      // no performer
    });

    // orderer.near - orderer id from contract generated by get_non_empty_contract
    let user_info = contract.get_users_tasks_info(env::signer_account_id());
    println!("user info: {:?}", user_info);

    assert!(user_info.is_some());
}
