interface PaginatorContent {
  setPerPage?: boolean;
  goToPage?: boolean;
}

interface PaginatorProps {
  page: number; // Current page index
  perPage: number; // Current page size
  totalItems: number; // Total number of items
  onPageChange: (page: number) => void; // Function to change the page
  onPerPageChange: (size: number) => void; // Function to change the page size
  perPageOptions?: number[];
  paginatorContent?: PaginatorContent;
}

/**
 * When component uses paginator, props should extend this interface to allow the user to customize pagination content and style
 */
export interface UsePagination {
  paginatorContent?: PaginatorContent;
}

const Paginator = ({
  page,
  perPage,
  totalItems,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 30, 40, 50],
  paginatorContent = { setPerPage: true, goToPage: true },
}: PaginatorProps) => {
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <div className="mt-4 flex justify-center items-center gap-2">
      <button onClick={() => onPageChange(0)} disabled={page === 0}>
        {"<<"}
      </button>
      <button
        onClick={() => onPageChange(Math.max(page - 1, 0))}
        disabled={page === 0}
      >
        {"<"}
      </button>
      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
        disabled={(page + 1) * perPage >= totalItems}
      >
        {">"}
      </button>
      <button
        onClick={() => onPageChange(totalPages - 1)}
        disabled={(page + 1) * perPage >= totalItems}
      >
        {">>"}
      </button>
      <span>
        Page{" "}
        <strong>
          {page + 1} of {totalPages}
        </strong>
      </span>
      {paginatorContent.goToPage && (
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={page + 1}
            min={1}
            max={totalPages}
            onChange={(e) => {
              const newPage = Number(e.target.value) - 1;
              onPageChange(
                newPage >= 0 && newPage < totalPages ? newPage : page,
              );
            }}
            style={{ width: "50px" }}
          />
        </span>
      )}
      {paginatorContent.setPerPage && (
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
        >
          {perPageOptions.map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Paginator;
