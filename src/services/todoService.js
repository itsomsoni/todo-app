import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Create a single instance for the JSONPlaceholder API
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Fetch all todos
export const fetchTodos = async () => {
  const { data } = await apiClient.get('/');
  return data;
};

// Create new todo - Accept the todo object dynamically
export const createTodo = async (todo) => {
  const { data } = await apiClient.post('/', todo);
  return data;
};

// Update existing todo - Using Template Literals
export const updateTodo = async (todo) => {
  const { data } = await apiClient.put(`/${todo.id}`, todo);
  return data;
};

// Delete todo
export const deleteTodo = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.status === 200; // Return success status
};