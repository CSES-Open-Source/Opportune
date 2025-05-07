import React, { useMemo } from "react";
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

export interface UsePagination {
  paginatorContent?: PaginatorContent;
}

interface PaginatorProps {
  page: number;                // zero-based
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (size: number) => void;
  perPageOptions?: number[];
  paginatorContent?: PaginatorContent;
}

const Paginator: React.FC<PaginatorProps> = ({
  page,
  perPage,
  totalItems,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 30, 40, 50],
  paginatorContent = { setPerPage: false, goToPage: false },
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  const pagesToShow = useMemo<(number | "...")[]>(() => {
    const result: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      if (page + 1 <= 4) {
        for (let i = 1; i <= 5; i++) result.push(i);
        result.push("...", totalPages);
      } else if (page + 1 >= totalPages - 3) {
        result.push(1, "...");
        for (let i = totalPages - 4; i <= totalPages; i++) result.push(i);
      } else {
        result.push(1, "...", page, page + 1, page + 2, "...", totalPages);
      }
    }
    return result;
  }, [page, totalPages]);

  return (
    <div className="flex flex-wrap items-center justify-between py-4 px-4 bg-white border-t">
      {paginatorContent.setPerPage && (
        <div className="hidden md:block">
          <select
            className="
              h-8 px-2
              border border-gray-300
              bg-white text-gray-600
              rounded-md text-sm
              focus:outline-none focus:ring-1 focus:ring-blue-500
              cursor-pointer
            "
            value={perPage}
            onChange={(e) => {
              onPerPageChange(Number(e.target.value));
              onPageChange(0);
            }}
          >
            {perPageOptions.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      )}
      {/* first/prev ... next/last) */}
      <div className="inline-flex items-center bg-gray-100 rounded-full p-1 space-x-1">
        <button
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          className="p-2 rounded-full text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <RxDoubleArrowLeft size={20} />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-2 rounded-full text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <RxChevronLeft size={20} />
        </button>

        {pagesToShow.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 text-gray-500">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p - 1)}
              disabled={p - 1 === page}
              className={`
                px-3 py-1 rounded-full text-sm
                ${
                  p - 1 === page
                    ? "bg-blue-600 text-white cursor-default"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className="p-2 rounded-full text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <RxChevronRight size={20} />
        </button>
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page + 1 >= totalPages}
          className="p-2 rounded-full text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <RxDoubleArrowRight size={20} />
        </button>
      </div>

      {/* per page dropdown */}
      {/* go to page */}
      {paginatorContent.goToPage && (
        <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
          <span>Go to:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            defaultValue={page + 1}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = Number((e.target as HTMLInputElement).value) - 1;
                if (v >= 0 && v < totalPages) onPageChange(v);
              }
            }}
            className="
              w-16 h-8 px-2
              border border-gray-300
              bg-white text-gray-700
              rounded-md text-sm
              focus:outline-none focus:ring-1 focus:ring-blue-500
            "
          />
        </div>
      )}
    </div>
  );
};

export default Paginator;