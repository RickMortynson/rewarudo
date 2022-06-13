use crate::test::*;

#[test]
fn normal_case() {
    testing_env!(get_context(ContextSetup {
        is_view: true,
        balance: None,
        deposit: None,
    }));

    let contract = get_empty_contract();

    let tasks = contract.get_tasks();
    println!("got tasks: {:?}", tasks);

    assert!(tasks.len() == 0)
}
