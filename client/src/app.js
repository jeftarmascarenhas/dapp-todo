import { useEffect, useState } from "react";
import "./app.css";
import getWeb3 from "./services/web3-service";
import TodoContract from "./contracts/Todo.json";
import { TodoList } from "./components";

function App() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    web3: null,
    contract: null,
    accounts: null,
    currentAccount: null,
  });

  const [formState, setForm] = useState({
    description: "",
  });

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
        console.error(error);
      }
    };
    loadWeb3();
  }, []);

  const handleSubmitTask = (event) => {
    event.preventDefault();
    const value = event.target.firstChild.value;
    console.log(value);
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
      </div>
    </>
  );
}

export default App;
