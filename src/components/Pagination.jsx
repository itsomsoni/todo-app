export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const handleDirectInput = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(e.target.value);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        e.target.value = "";
      }
    }
  };

  return (
    <>
      <div className="pagination-container">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Prev
        </button>

        <div className="page-numbers">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`page-btn ${currentPage === page ? "active" : ""} ${
                page === "..." ? "dots" : ""
              }`}
              onClick={() => page !== "..." && onPageChange(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        {/* Direct Page Navigation */}
        <div className="direct-input-container">
          <span className="direct-input-label">Go to:</span>
          <input
            type="number"
            className="direct-page-input"
            min={1}
            max={totalPages}
            placeholder="#"
            onKeyDown={handleDirectInput}
          />
        </div>
      </div>
    </>
  );
}