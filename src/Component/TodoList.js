import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import axios from "axios";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [editTaskId, setEditTaskId] = useState(null);
  const [reload, setReload] = useState(false);
  const [taskStatus, setTaskStatus] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, [reload]);

  // Fetch data
  const fetchTodos = async () => {
    try {
      const response = await axios.get("https://todos-uknp.onrender.com/api/v1/todos");
      console.log(response);
      // const todos = await response.json();
      setTasks(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching todos:", error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Add
  const handleAddTask = async () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTask = {
      title: inputValue,
    };

    try {
      const response = await axios.post(
        "https://todos-uknp.onrender.com/api/v1/todos",
        newTask
      );
      console.log(response);
      // const addedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setInputValue("");
      toast.success("Task added successfully");
      setReload(Math.random());
    } catch (error) {
      console.log("Error adding task:", error);
      toast.error("Error adding task");
    }
  };

  const handleTaskCheckboxChange = (taskId) => {
    // setTasks((prevTasks) =>
    //   prevTasks.map((task) =>
    //     task._id === taskId ? { ...task, completed: !task.completed } : task
    //   )
    // );

    let checkbox = document.getElementById(taskId)
    console.log("🚀 ~ file: TodoList.js:72 ~ handleTaskCheckboxChange ~ taskId:", taskId)
    

    console.log(checkbox)


    // if(checkbox.checked) {
    //   console.log("Checked");
    //   return true
    // } else {
    //   console.log("Not checked")
    //   return false
    // }
    
    
  };


  // Delete

  const handleDeleteTask = async (taskId) => {
    // setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

    toast.success("Task deleted successfully");
    try {
      await axios.delete(`https://todos-uknp.onrender.com/api/v1/todos/${taskId}`);
    } catch (error) {
      console.log("Error Delete task", error);
      toast.error("Error adding task");
    }

    setReload(Math.random());
  };

  // Edit
  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find((task) => task._id === taskId);
    setInputValue(taskToEdit.title);
  };

  // Update
  const handleUpdateTask = async () => {
    if (inputValue.trim() === "") {
      return;
    }

    const updatedTask = {
      title: inputValue,
    };

    try {
      const response = await fetch(
        `https://todos-uknp.onrender.com/api/v1/todos/${editTaskId}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedTask),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const updatedTaskData = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editTaskId
            ? { ...task, title: updatedTaskData.title }
            : task
        )
      );
      setInputValue("");
      setEditTaskId(null);
      setReload(Math.random());
      toast.success("Task updated successfully");
    } catch (error) {
      console.log("Error updating task:", error);
      toast.error("Error updating task");
    }
  };

  // Mark all tasks as completed
  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    );
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else if (filter === "completed") {
      return task.completed;
    } else if (filter === "uncompleted") {
      return !task.completed;
    }
    return true;
  });

  // Display loading message while data is being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the todo list
  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
        <h2>Todo List</h2>
        <div className="row">
          <i className="fas fa-list-check"></i>
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="Add your todo"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            id="btn"
            onClick={editTaskId ? handleUpdateTask : handleAddTask}
          >
            {editTaskId ? "Update" : "Add"}
          </button>
        </div>

        {/* <div className="mid">
          <i className="fas fa-check-double"></i>
          <p id="complete-all" onClick={handleCompleteAll}>
            Complete all tasks
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Delete comp tasks
          </p>
        </div> */}

        <ul id="list">
          {tasks.map((task) => (
            <li key={task._id}>
              <input
                type="checkbox"
                id={`task-${task._id}`}
                data-id={task._id}
                className="custom-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task._id)}
              />
              <label htmlFor={`task-${task._id}`}>{task.title}</label>
              <div>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                  className="edit"
                  data-id={task._id}
                  onClick={() => handleEditTask(task._id)}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                  className="delete"
                  data-id={task._id}
                  onClick={() => handleDeleteTask(task._id)}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Filter</button>
            <div className="dropdown-content">
              <a href="#" id="all" onClick={() => handleFilterChange("all")}>
                All
              </a>
              <a
                href="#"
                id="rem"
                onClick={() => handleFilterChange("uncompleted")}
              >
                Uncompleted
              </a>
              <a
                href="#"
                id="com"
                onClick={() => handleFilterChange("completed")}
              >
                Completed
              </a>
            </div>
          </div>

          <div className="completed-task">
            <p>
              Completed:{" "}
              <span id="c-count">
                {tasks.filter((task) => task.completed).length}
              </span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
