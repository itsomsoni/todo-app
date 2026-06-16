export default function TodoTable({ todos, onEdit, onDelete }) {
  if (todos.length === 0) {
    return <div className="no-results">No todos found.</div>;
  }
  return (
    <>
      <div className="table-container">
        <table className="todo-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>
                  <span
                    className={`status-badge ${
                      todo.completed ? "completed" : "pending"
                    }`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => onEdit(todo)}>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
