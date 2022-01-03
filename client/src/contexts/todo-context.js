import { createContext, useReducer, useMemo, useEffect } from "react";
import { actions } from ".";
import { useLoadWeb3 } from "../hooks";
import { todoReducer, initialState } from "./reducers";

export const TodoContext = createContext(null);

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const response = useLoadWeb3();

  useEffect(() => {
    if (response.web3) {
      dispatch({
        type: actions.CONNECT_TO_ETHEREUM_NETWORK,
        payload: response,
      });
    }
  }, [response]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
