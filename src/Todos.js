import React, { useState, useEffect } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleTodo = () => {
    if (todo.trim() !== "") {
      const newTodo = {
        id: new Date().getTime(),
        text: todo,
        completed: false,
        dueDate: dueDate || "",
        priority: priority || "Low",
      };

      setTodos([...todos, newTodo]);
      setTodo("");
      setDueDate("");
      setPriority("Low");
    }
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    setCompletedTodos(
      completedTodos.filter((completedTodo) => completedTodo.id !== id)
    );
  };

  const handleToggleComplete = (id) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    if (todoToToggle) {
      todoToToggle.completed = !todoToToggle.completed;

      if (todoToToggle.completed) {
        setCompletedTodos([...completedTodos, todoToToggle]);
      } else {
        setCompletedTodos(
          completedTodos.filter((completedTodo) => completedTodo.id !== id)
        );
      }

      updatedTodos.push(todoToToggle);
      setTodos(updatedTodos);
    }
  };

  const handleEdit = (id) => {
    setEditingTodoId(id);
  };

  const handleEditChange = (e, id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: e.target.value } : todo
    );
    setTodos(updatedTodos);
  };

  const handleEditBlur = (id) => {
    setEditingTodoId(null);
  };

  const handleClearCompleted = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setCompletedTodos([]);
    setTodos(updatedTodos);
  };

  const handleDueDateChange = (e, id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, dueDate: e.target.value } : todo
    );
    setTodos(updatedTodos);
  };

  const handlePriorityChange = (e, id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, priority: e.target.value } : todo
    );
    setTodos(updatedTodos);
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") {
      return !todo.completed;
    } else if (filter === "Completed") {
      return todo.completed;
    }
    return true; // "All" filter
  });

  return (
    <div className="App">
      <input
        placeholder="Add Todo"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button onClick={handleTodo}>Add</button>
      <div>
        {filteredTodos
          .sort((a, b) => {
            const priorityOrder = { Low: 1, Medium: 2, High: 3 };
            return (
              priorityOrder[b.priority || "Low"] -
              priorityOrder[a.priority || "Low"]
            );
          })
          .map((todo) => (
            <ul key={todo.id}>
              <li>
                <input
                  type="checkbox"
                  checked={
                    todo.completed ||
                    completedTodos.some((t) => t.id === todo.id)
                  }
                  onChange={() => handleToggleComplete(todo.id)}
                />
                {editingTodoId === todo.id ? (
                  <>
                    <input
                      value={todo.text}
                      onChange={(e) => handleEditChange(e, todo.id)}
                      onBlur={() => handleEditBlur(todo.id)}
                    />
                    <button onClick={() => handleEditBlur(todo.id)}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        textDecoration: todo.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {todo.text}
                    </span>
                    {todo.priority && <span>Priority: {todo.priority}</span>}
                    {todo.dueDate && <span>Due: {todo.dueDate}</span>}
                    <button onClick={() => handleEdit(todo.id)}>Edit</button>
                  </>
                )}
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
                {todo.dueDate && (
                  <input
                    type="date"
                    value={todo.dueDate}
                    onChange={(e) => handleDueDateChange(e, todo.id)}
                  />
                )}
                <select
                  value={todo.priority || priority}
                  onChange={(e) => handlePriorityChange(e, todo.id)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </li>
            </ul>
          ))}
      </div>
      {completedTodos.length > 0 && (
        <button onClick={handleClearCompleted}>Clear Completed</button>
      )}
      <p>
        {remainingTodos} remaining {remainingTodos === 1 ? "todo" : "todos"}
      </p>
      <button onClick={() => setFilter("All")}>All</button>
      <button onClick={() => setFilter("Active")}>Active</button>
      <button onClick={() => setFilter("Completed")}>Completed</button>
    </div>
  );
}
