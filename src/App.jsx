import { useState, useEffect } from "react";
import "./App.css";
import {
  createTodo,
  fetchTodos,
  updateTodo,
} from "../../todo-app/src/services/todoService";
import TodoTable from "../../todo-app/src/components/TodoTable";
import TodoForm from "../../todo-app/src/components/TodoForm";

// const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = "todo_app_data";

const getStoredTodos = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storeTodos = (todos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    console.error("Failed to save to localStorage");
  }
};

const getNextId = (todos) => {
  if (todos.length === 0) return 1;
  return Math.max(...todos.map((t) => t.id)) + 1;
};

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch Todos On Load
  useEffect(() => {
    const loadTodos = async () => {
      try {
        // Check localStorage first
        const stored = getStoredTodos();
        if (stored) {
          setTodos(stored);
          return; // skip API call
        }
        // If no localStorage data fetch from API
        setLoading(true);
        setError(null);
        const data = await fetchTodos();
        setTodos(data);
        storeTodos(data); // save to localStorage
      } catch (err) {
        setError(`Failed to fetch todos. Please try again. - ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, []);

  // Sync Todos To LocalStorage
  useEffect(() => {
    if (todos.length > 0) {
      storeTodos(todos);
    }
  }, [todos]);

  /* Todo Form Handlers */
  const handleEditClick = (todo) => {
    setSelectedTodo(todo);
    setShowForm(true);
  };
  
  const handleAddClick = () => {
    setSelectedTodo(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedTodo(null);
  };

  const handleCreate = async (formData) => {
    try {
      await createTodo(formData);
      const newTodo = {
        id: getNextId(todos), // clean sequential ID
        title: formData.title,
        completed: formData.completed,
        userId: 1,
      };
      setTodos((prev) => [newTodo, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError(`Failed to create todo. Please try again. - ${err.message}`);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      // Use id 1 as fallback for API
      // since JSONPlaceholder only accepts 1-200
      const apiId = formData.id > 200 ? 1 : formData.id;
      await updateTodo({ ...formData, id: apiId });

      const updatedTodo = {
        ...formData,
        title: formData.title,
        completed: formData.completed,
      };
      setTodos((prev) =>
        prev.map((todo) => (todo.id === formData.id ? updatedTodo : todo)),
      );
      setShowForm(false);
      setSelectedTodo(null);
    } catch (err) {
      setError(`Failed to update todo. Please try again. - ${err.message}`);
    }
  };

  return (
    <>
      <div className="app-container">
        <h1 className="app-title">Todo Management</h1>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Add Button */}
        <div className="toolbar">
          <button className="btn-primary" onClick={handleAddClick}>
            + Add Todo
          </button>
        </div>

        {/* Form — Create or Edit */}
        {showForm && (
          <TodoForm
            selectedTodo={selectedTodo}
            onSubmit={selectedTodo ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        )}

        {/* Loading */}
        {loading && <div className="loading">Loading todos...</div>}

        {/* Table */}
        {!loading && (
          <TodoTable todos={todos} onEdit={handleEditClick} onDelete={() => {}} />
        )}
      </div>
    </>
  );
}

export default App;
