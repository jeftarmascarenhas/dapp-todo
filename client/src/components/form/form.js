import { useContext, useState } from "react";
import { actions, TodoContext } from "../../contexts";
import "./form.css";

const Form = () => {
  const [formState, setForm] = useState({
    description: "",
  });

  const { state, dispatch } = useContext(TodoContext);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...formState,
      [name]: value,
    });
  };

  const handleAddTask = async () => {
    const { description: taskValue } = formState;
    const { contract, currentAccount } = state;

    dispatch({
      type: actions.LOADING_APPLICATION,
    });

    try {
      const response = await contract.methods.addTask(taskValue).send({
        from: currentAccount,
      });

      const { id, completed, description } =
        response.events.AddTaskCreated.returnValues;

      const payload = { id, completed, description };

      dispatch({
        type: actions.ADD_TASK,
        payload,
      });
      setForm((prevState) => ({
        ...prevState,
        description: "",
      }));
    } catch (error) {
      console.log("addTask_error: ", error);
      dispatch({
        type: actions.LOADING_APPLICATION,
      });
    }
  };

  const handleSubmitTask = (event) => {
    event.preventDefault();
    handleAddTask();
  };
  return (
    <form className="app-form" onSubmit={handleSubmitTask} noValidate>
      <input
        name="description"
        id="description"
        className="app-input"
        placeholder="Write the new task"
        value={formState.description}
        onChange={handleChange}
      />
      <button
        className="app-button"
        type="submit"
        disabled={!formState.description}
      >
        +
      </button>
    </form>
  );
};

export default Form;
