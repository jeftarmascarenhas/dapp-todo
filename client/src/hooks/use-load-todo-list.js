import { useState, useEffect } from "react";

const useLoadTodoList = (contract) => {
  const [loading, setLoading] = useState(false);
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
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
  }, [contract]);

  return {
    todoList,
    loading,
  };
};

export default useLoadTodoList;
