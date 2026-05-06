import {
  RxChevronLeft,
  RxChevronRight,
  RxDoubleArrowLeft,
  RxDoubleArrowRight,
} from "react-icons/rx";

interface PaginatorContent {
  setPerPage?: boolean;
  goToPage?: boolean;
}

interface PaginatorProps {
  page: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (size: number) => void;
  perPageOptions?: number[];
  paginatorContent?: PaginatorContent;
}

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
  paginatorContent = { setPerPage: false, goToPage: false },
}: PaginatorProps) => {
  const totalPages = Math.ceil(totalItems / perPage);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="relative mt-6 flex justify-center items-center gap-4">
      {/* Show N dropdown */}
      {paginatorContent.setPerPage && (
        <select
          className="absolute left-0 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all outline-none"
          style={{
            background: "#141920",
            border: "1px solid #2d3748",
            color: "#e8eaed",
          }}
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

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: page === 0 ? "#141920" : "#1e2433",
            border: "1px solid #2d3748",
            color: page === 0 ? "#6b7280" : "#5b8ef4",
          }}
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          aria-label="First page"
        >
          <RxDoubleArrowLeft size={16} className="stroke-[0.75]" />
        </button>

        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: page === 0 ? "#141920" : "#1e2433",
            border: "1px solid #2d3748",
            color: page === 0 ? "#6b7280" : "#5b8ef4",
          }}
          onClick={() => onPageChange(Math.max(page - 1, 0))}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <RxChevronLeft size={16} className="stroke-[0.75]" />
        </button>

        {/* Page indicator */}
        <span className="px-4 py-2 text-sm font-medium text-[#e8eaed]">
          Page {page + 1} of {totalPages === 0 ? 1 : totalPages}
        </span>

        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: (page + 1) * perPage >= totalItems ? "#141920" : "#1e2433",
            border: "1px solid #2d3748",
            color: (page + 1) * perPage >= totalItems ? "#6b7280" : "#5b8ef4",
          }}
          onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
          disabled={(page + 1) * perPage >= totalItems}
          aria-label="Next page"
        >
          <RxChevronRight size={16} className="stroke-[0.75]" />
        </button>

        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: (page + 1) * perPage >= totalItems ? "#141920" : "#1e2433",
            border: "1px solid #2d3748",
            color: (page + 1) * perPage >= totalItems ? "#6b7280" : "#5b8ef4",
          }}
          onClick={() => onPageChange(totalPages - 1)}
          disabled={(page + 1) * perPage >= totalItems}
          aria-label="Last page"
        >
          <RxDoubleArrowRight size={16} className="stroke-[0.75]" />
        </button>
      </div>

      {/* Go to page input */}
      {paginatorContent.goToPage && (
        <div className="absolute right-0 flex items-center gap-2">
          <span className="text-sm text-[#9ca3af]">Go to page:</span>
          <input
            type="number"
            defaultValue={page + 1}
            min={1}
            max={totalPages}
            className="w-16 px-2 py-1.5 rounded-lg text-sm text-center outline-none transition-all"
            style={{
              background: "#141920",
              border: "1px solid #2d3748",
              color: "#e8eaed",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#5b8ef4")}
            onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
            onChange={(e) => {
              const newPage = Number(e.target.value) - 1;
              onPageChange(
                newPage >= 0 && newPage < totalPages ? newPage : page
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Paginator;