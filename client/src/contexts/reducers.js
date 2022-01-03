import actions from "./actions";

export const initialState = {
  web3: null,
  contract: null,
  accounts: null,
  currentAccount: null,
  todoList: [],
  loading: false,
};

const mapping = {
  [actions.CONNECT_TO_ETHEREUM_NETWORK]: (state, action) => ({
    ...state,
    web3: action.payload.web3,
    contract: action.payload.contract,
    accounts: action.payload.accounts,
    currentAccount: action.payload.currentAccount,
  }),
  [actions.LOADING_APPLICATION]: (state) => ({
    ...state,
    loading: !state.loading,
  }),
  [actions.LOAD_TODO_LIST]: (state, action) => ({
    ...state,
    todoList: action.payload,
    loading: false,
  }),
  [actions.ADD_TASK]: (state, action) => {
    return {
      ...state,
      todoList: [...state.todoList, action.payload],
      loading: false,
    };
  },
  [actions.COMPLETED_TOGGLE]: (state, action) => {
    const todoUpdated = state.todoList.map((task) => {
      if (action.payload.id === task.id) {
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });

    return {
      ...state,
      todoList: todoUpdated,
      loading: false,
    };
  },
};
export const todoReducer = (state = initialState, action) =>
  mapping[action.type] ? mapping[action.type](state, action) : state;
