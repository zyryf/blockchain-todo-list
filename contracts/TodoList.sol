// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    uint256 public taskNumber = 0;

    struct Task {
        uint256 id;
        string description;
        bool isCompleted;
    }

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _content) public {
        taskNumber++;
        tasks[taskNumber] = Task(taskNumber, _content, false);
    }

    function deleteTask(uint256 _id) public {
        delete tasks[_id];
        taskNumber--;
    }

    function getTaskNumber() public view returns (uint256) {
        return taskNumber;
    }

    constructor() public {
        createTask("first task");
    }
}
