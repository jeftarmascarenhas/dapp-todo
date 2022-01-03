import { useState, useEffect } from "react";
import getWeb3 from "../services/web3-service";
import TodoContract from "../contracts/Todo.json";

export const useLoadWeb3 = () => {
  const [state, setState] = useState({
    web3: null,
    contract: null,
    accounts: null,
    currentAccount: null,
  });
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
  return state;
};
