use super::*;

use near_sdk::test_utils::VMContextBuilder;
use near_sdk::{testing_env, VMContext};

fn get_context(account_id: &str) -> VMContext {
  let test_user = String::from(account_id);
  let account = AccountId::try_from(test_user).unwrap();
  let context = VMContextBuilder::new().signer_account_id(account).build();
  return context;
}

fn get_contract() -> Contract {
  Contract {
    tasks: UnorderedMap::<String, Task>::new(b"U"),
  }
}

#[test]
fn get_tasks() {
  let test_user = String::from("unicorn.testnet");
  let context = get_context(&test_user);
  // let account_id = AccountId::try_from(test_user).unwrap();

  testing_env!(context.clone());
  let contract = get_contract();

  let tasks = contract.get_tasks();
  println!("{:?}", tasks);
  //
  assert!(tasks.len() == 0)
}

#[test]
fn create_task() {
  let test_user = String::from("unicorn.testnet");
  let context = get_context(&test_user);

  testing_env!(context.clone());
  let mut contract = get_contract();

  let tasks_before = contract.get_tasks();
  println!("tasks before: {:?}", tasks_before);

  contract.create_task(String::from("Development"), 9874653);

  let tasks_after = contract.get_tasks();
  println!("tasks after: {:?}", tasks_after);
  //
  assert!(tasks_after.len() > tasks_before.len())
}

#[test]
fn get_users_ordered_tasks() {
  let test_user = String::from("unicorn.testnet");
  let context = get_context(&test_user);

  testing_env!(context.clone());
  let mut contract = get_contract();

  contract.create_task(String::from("Development"), 9874653);
  println!("task created");

  let ordered = contract.get_users_ordered_tasks(AccountId::try_from(test_user).unwrap());
  println!("ordered: {:?}", ordered);

  assert!(ordered.len() == 1);
}

#[test]
#[should_panic]
fn take_own_task() {
  let test_user = String::from("unicorn.testnet");
  let context = get_context(&test_user);

  testing_env!(context);
  let mut contract = get_contract();

  println!("creating task..");
  let task_id = contract.create_task(String::from("Development"), 9874653);

  println!("all tasks: {:?}", contract.get_tasks());

  println!("taking task..");
  contract.take_task(task_id);
}
