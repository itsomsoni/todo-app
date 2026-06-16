import { useState, useEffect } from "react";
import "./App.css";
import { fetchTodos } from "../../todo-app/src/services/todoService";
import TodoTable from "../../todo-app/src/components/TodoTable";

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

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch Todos On Load ───────────────────────
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

  // ── Sync Todos To LocalStorage ─────────────────
  useEffect(() => {
    if (todos.length > 0) {
      storeTodos(todos);
    }
  }, [todos]);

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

        {/* Loading */}
        {loading && <div className="loading">Loading todos...</div>}

        {/* Table */}
        {!loading && (
          <TodoTable todos={todos} onEdit={() => {}} onDelete={() => {}} />
        )}
      </div>
    </>
  );
}

export default App;
