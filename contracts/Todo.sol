// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Todo {
    struct Task {
        uint256 id;
        string description;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;

    uint256 public taskCount = 0;
    address minter;

    constructor() {
        addTask("NFT Choose, nftchoose.com");
    }

    event AddTaskCreated(uint256 id, string description, bool completed);
    event CompletedTaskCreated(uint256 id, bool completed);

    function addTask(string memory _description) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _description, false);
        emit AddTaskCreated(taskCount, _description, false);
    }

    function completeTaskToggle(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit CompletedTaskCreated(_id, _task.completed);
    }
}
