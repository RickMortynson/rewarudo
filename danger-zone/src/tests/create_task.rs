use crate::test::*;

#[test]
fn normal_case() {
    testing_env!(get_context(ContextSetup {
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
