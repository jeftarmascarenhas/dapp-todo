import { useEffect, useContext } from "react";
import { TodoContext, actions } from "../../contexts";
import { Task } from "../task";
import "./todo-list.css";

const TodoList = () => {
  const { state, dispatch } = useContext(TodoContext);

  const handleCompletedTaskToggle = async (id) => {
    try {
      dispatch({
        type: actions.LOADING_APPLICATION,
      });
      await state.contract.methods.completeTaskToggle(id).send({
        from: state.currentAccount,
      });

      dispatch({
        type: actions.COMPLETED_TOGGLE,
        payload: { id },
      });
    } catch (error) {
      console.log("CompletedTaskToggle_error: ", error);
      dispatch({
        type: actions.LOADING_APPLICATION,
      });
    }
  };

  useEffect(() => {
    const loadTodoList = async () => {
      try {
        dispatch({
          type: actions.LOADING_APPLICATION,
        });

        const taskCount = await state.contract.methods.taskCount().call();

        const todos = [];

        for (let i = 1; i <= taskCount; i++) {
          const todoList = await state.contract.methods.tasks(i).call();
          todos.push({
            id: todoList.id,
            description: todoList.description,
            completed: todoList.completed,
          });
        }
        dispatch({
          type: actions.LOAD_TODO_LIST,
          payload: todos,
        });
      } catch (error) {
        console.error(error);
        dispatch({
          type: actions.LOADING_APPLICATION,
        });
      }
    };
    if (state.contract) {
      loadTodoList();
    }
  }, [state.contract, dispatch]);

  if (!state.todoList.length && state.loading) {
    return <p>Empty Task</p>;
  }

  return (
    <div className="todo-list ">
      {!!state.todoList.length &&
        state.todoList.map((task) => (
          <Task key={task.id} task={task} onCheck={handleCompletedTaskToggle} />
        ))}
    </div>
  );
};

export default TodoList;
