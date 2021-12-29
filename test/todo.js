const TodoList = artifacts.require("./Todo.sol");

contract("Todo List Contract", (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.todoList.address;

    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("should get default task", async () => {
    const defaultTask = "NFT Choose, nftchoose.com";
    const getDefaultTask = await this.todoList.tasks.call(1);

    assert.equal(getDefaultTask.description, defaultTask);
  });
});
