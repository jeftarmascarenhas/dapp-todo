import { useContext, useEffect, useState } from "react";
import "./app.css";
import { Loading, TodoList, Form } from "./components";
import { TodoContext } from "./contexts";

function App() {
  const { state } = useContext(TodoContext);

  const [hasNotBalance, setHasNotBalance] = useState(false);

  const handleCheckAccountBalance = (balance) => {
    console.log(balance);
    if (Number(balance) <= 0) {
      setHasNotBalance(true);
    } else {
      setHasNotBalance(false);
    }
  };

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

  return (
    <>
      <div className="app">
        <h1 className="app-title">Todo List - Blockchain</h1>
        <Form />
        <br />
        {<TodoList contract={state.contract} />}
        {state.loading && <Loading />}
      </div>
      {hasNotBalance && state.currentAccount && (
        <div className="alert alert--warn">This account has no balance</div>
      )}
    </>
  );
}

export default App;
