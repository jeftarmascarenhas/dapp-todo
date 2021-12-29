import { useEffect, useState } from "react";
import "./app.css";
import getWeb3 from "./services/web3-service";
import TodoContract from "./contracts/Todo.json";
import { TodoList } from "./components";

function App() {
  const [loadingApplication, setLoadingApplication] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    web3: null,
    contract: null,
    accounts: null,
    currentAccount: null,
  });
  const [todoList, setTodoList] = useState([]);
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
        setLoadingApplication(true);
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

        setLoadingApplication(false);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details`
        );
        setLoadingApplication(false);
        console.error(error);
      }
    };
    loadWeb3();
  }, []);

  useEffect(() => {
    const { web3 } = state;

    if (window.ethereum !== undefined && web3) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        const currentAccount = accounts[0];
        const currentAccountBalance = await web3.eth.getBalance(currentAccount);
        handleCheckAccountBalance(currentAccountBalance);
      });
    }
  }, [state]);

  useEffect(() => {
    const { contract } = state;
    const loadTodoList = async () => {
      try {
        setLoading(true);
        const taskCount = await contract.methods.taskCount().call();

        const todos = [];

        for (let i = 1; i <= taskCount; i++) {
          const todoList = await contract.methods.tasks(i).call();
          todos.push({
            id: todoList.id,
            description: todoList.description,
            completed: todoList.completed,
          });
        }

        setTodoList(todos);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    if (contract) {
      loadTodoList();
    }
  }, [state.contract]);

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

      const todoListUpdated = [...todoList, newTask];

      setLoading(false);
      setTodoList(todoListUpdated);
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
            name="task"
            id="task"
            className="app-input"
            placeholder="Write the new task"
            value={formState.description}
            onChange={handleChange}
          />
          <button className="app-button">+</button>
        </form>
        <br />
        <TodoList todoList={todoList} />
        {loading && (
          <div className="task-loading">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
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
