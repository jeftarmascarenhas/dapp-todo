import "./task.css";

const Task = ({ task, onCheck }) => {
  return (
    <div className="todo-list-task task">
      <input
        type="checkbox"
        className="task__check"
        name="task-complete"
        id={`task-${task.id}`}
        onChange={() => onCheck(task.id)}
        checked={task.completed}
      />
      <h3
        className={`task__description ${
          task.completed ? "task--completed" : ""
        }`}
        title={task.description}
      >
        {task.description}
      </h3>
    </div>
  );
};

export default Task;
