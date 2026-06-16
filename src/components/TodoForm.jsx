import { useState, useEffect } from "react";

export default function TodoForm({ selectedTodo, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    completed: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTodo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        id: selectedTodo.id,
        title: selectedTodo.title,
        completed: selectedTodo.completed,
      });
    } else {
      setFormData({ title: "", completed: false });
    }
  }, [selectedTodo]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <>
      <div className="form-overlay">
        <div className="form-container">
          <h2 className="form-title">
            {selectedTodo ? "Edit Todo" : "Create New Todo"}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <div className="form-group">
              <label className="form-label">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                className={`form-input ${errors.title ? "input-error" : ""}`}
                placeholder="Enter todo title..."
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            {/* Completed Status */}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                />
                Mark as Completed
              </label>
            </div>

            {/* Buttons */}
            <div className="form-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {selectedTodo ? "Update Todo" : "Create Todo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
