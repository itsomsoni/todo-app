import { useState, useEffect, useMemo } from "react";
import "./App.css";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from "./services/todoService";
import TodoTable from "./components/TodoTable";
import TodoForm from "./components/TodoForm";
import useDebounce from "./hooks/useDebounce";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";

const ITEMS_PER_PAGE = 10;
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

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 200);

  const [currentPage, setCurrentPage] = useState(1);

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

  /* Pagination & Search */
  const filteredTodos = useMemo(() => {
    if (!debouncedSearch.trim()) return todos;
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [todos, debouncedSearch]);

  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);

  const paginatedTodos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTodos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTodos, currentPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [debouncedSearch]);

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
      setShowForm(false);
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
      setShowForm(false);
      setSelectedTodo(null);
      setError(`Failed to update todo. Please try again. - ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this todo?",
    );
    if (!confirmed) return;
    try {
      // Use id 1 as fallback for API
      const apiId = id > 200 ? 1 : id;
      const deleted = await deleteTodo(apiId);
      if (deleted) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        if (paginatedTodos.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      } else {
        setError("Failed to delete todo. Please try again.");
      }
    } catch (err) {
      setError(`Failed to delete todo. Please try again. - ${err.message}`);
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
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(val) => setSearchTerm(val)}
          />
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
          <TodoTable
            todos={paginatedTodos}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination */}
        {!loading && filteredTodos.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}

export default App;
