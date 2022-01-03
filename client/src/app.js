import { useContext, useEffect, useState } from "react";
import "./app.css";
import getWeb3 from "./services/web3-service";
import TodoContract from "./contracts/Todo.json";
import { Loading, TodoList } from "./components";
import { TodoContext, actions } from "./contexts";

function App() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    web3: null,
    contract: null,
    accounts: null,
    currentAccount: null,
  });
  const { dispatch } = useContext(TodoContext);

  const [hasNotBalance, setHasNotBalance] = useState(false);
  const [formState, setForm] = useState({
    description: "",
  });

  const handleCheckAccountBalance = (balance) => {
    if (Number(balance) <= 0) {
      setHasNotBalance(true);
    } else {
      setHasNotBalance(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...formState,
      [name]: value,
    });
  };

  useEffect(() => {
    const loadWeb3 = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();

        // Get contract address
        const deployedNetwork = TodoContract.networks[networkId];

        const contract = new web3.eth.Contract(
          TodoContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        const currentAccount = accounts[0];

        const currentAccountBalance = await web3.eth.getBalance(currentAccount);
        handleCheckAccountBalance(currentAccountBalance);

        setState({ web3, contract, accounts, currentAccount: currentAccount });
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details`
        );
        console.log("loading web3 error: ", error);
      }
    };
    loadWeb3();
  }, []);

  useEffect(() => {
    const { web3 } = state;

    if (window.ethereum !== undefined && web3) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        try {
          const currentAccount = accounts[0];
          const currentAccountBalance = await web3.eth.getBalance(
            currentAccount
          );
          handleCheckAccountBalance(currentAccountBalance);
        } catch (error) {
          console.log("change account error: ", error);
        }
      });
    }
  }, [state]);

  const handleAddTask = async (value) => {
    const { contract, currentAccount } = state;

    try {
      setLoading(true);
      const response = await contract.methods.addTask(value).send({
        from: currentAccount,
      });

      const { id, completed, description } =
        response.events.AddTaskCreated.returnValues;

      const newTask = { id, completed, description };

      dispatch({
        type: actions.ADD_TASK,
        payload: newTask,
      });

      setLoading(false);
      // setTodoList(todoListUpdated);
    } catch (error) {
      setLoading(false);
      console.log("addTask_error: ", error);
    }
  };

  const handleSubmitTask = (event) => {
    event.preventDefault();
    const value = event.target.firstChild.value;
    handleAddTask(value);
  };

  return (
    <>
      <div className="app">
        <h1 className="app-title">Todo List - Blockchain</h1>
        <form className="app-form" onSubmit={handleSubmitTask}>
          <input
            name="description"
            id="description"
            className="app-input"
            placeholder="Write the new task"
            value={formState.description}
            onChange={handleChange}
          />
          <button className="app-button">+</button>
        </form>
        <br />
        {<TodoList contract={state.contract} />}
        {loading && <Loading />}
      </div>
      {hasNotBalance && state.currentAccount && (
        <div className="alert alert--warn">
          This account doesn't has balance
        </div>
      )}
    </>
  );
}

export default App;
