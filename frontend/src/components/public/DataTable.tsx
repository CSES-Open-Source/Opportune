import { useEffect, useState } from "react";
import { PaginatedData } from "../../types/PaginatedData";
import Paginator, { UsePagination } from "./Paginator";
import { ColumnDef } from "../../types/ColumnDef";
import { ProgressSpinner } from "primereact/progressspinner";

interface TableStyle {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}

interface BaseDataTableProps<T extends object> {
  data?: T[];
  pageType: string;
  fetchData?: (page: number, perPage: number) => Promise<PaginatedData<T>>;
  columns: ColumnDef<T>[];
  useServerPagination?: boolean;
  usePagination?: boolean;
  onRowClick?: (row: T) => void;
  tableStyle?: TableStyle;
}

interface DataTableNoPaginationProps<T extends object>
  extends BaseDataTableProps<T> {
  data: T[];
  fetchData?: undefined;
  usePagination?: false;
  useServerPagination?: false;
}

interface DataTablePaginationProps<T extends object>
  extends BaseDataTableProps<T>,
    UsePagination {
  data: T[];
  fetchData?: undefined;
  usePagination: true;
  useServerPagination?: false;
}

interface DataTableServerPaginationProps<T extends object>
  extends BaseDataTableProps<T>,
    UsePagination {
  data?: undefined;
  fetchData: (page: number, perPage: number) => Promise<PaginatedData<T>>;
  usePagination?: true;
  useServerPagination: true;
}

type DataTableProps<T extends object> =
  | DataTableNoPaginationProps<T>
  | DataTablePaginationProps<T>
  | DataTableServerPaginationProps<T>;

const DataTable = <T extends object>(props: DataTableProps<T>) => {
  const { columns, onRowClick, tableStyle, useServerPagination, pageType } = props;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!useServerPagination) {
      const inputData = props.data;
      setLoading(true);
      if (props.usePagination) {
        setData(inputData.slice(page * perPage, (page + 1) * perPage));
        setTotalItems(inputData.length);
        setLoading(false);
      } else {
        setData(inputData);
        setTotalItems(inputData.length);
        setLoading(false);
      }
    }
  }, [props.data, props.usePagination, page, perPage, useServerPagination]);

  useEffect(() => {
    const loadData = async () => {
      if (useServerPagination) {
        const fetchData = props.fetchData;
        setLoading(true);
        const response = await fetchData(page, perPage);
        setData(response.data);
        setTotalItems(response.total);
        setLoading(false);
      }
    };

    loadData();
  }, [page, perPage, props.fetchData, useServerPagination]);

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div>
      <div
        style={{
          ...tableStyle,
          background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
          borderColor: "#2d3748",
        }}
        className="overflow-auto border rounded-2xl shadow-2xl"
      >
        <table style={{ borderCollapse: "collapse" }} className="w-full">
          <thead>
            <tr style={{ background: "#141920" }}>
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={{
                    width: column.width,
                    overflowX: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #2d3748",
                  }}
                  className="px-[14px] py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="w-full">
                <td colSpan={columns.length} className="h-[500px] text-center">
                  <ProgressSpinner className="h-16 w-16" strokeWidth="3" style={{ color: "#5b8ef4" }} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                {pageType === "saved" ? (
                  <td 
                    colSpan={columns.length} 
                    className="text-center py-16"
                    style={{ borderBottom: "1px solid #2d3748" }}
                  >
                    <p className="text-[#9ca3af] mb-2">No saved applications found.</p>
                    <p className="text-[#6b7280] text-sm">
                      Click on <span className="font-semibold text-[#5b8ef4]">New Saved Application</span> to store an
                      application you are still working on.
                    </p>
                  </td>
                ) : (
                  <td 
                    colSpan={columns.length} 
                    className="text-center py-16"
                    style={{ borderBottom: "1px solid #2d3748" }}
                  >
                    <p className="text-[#9ca3af] mb-2">No applications found.</p>
                    <p className="text-[#6b7280] text-sm">
                      To add more entries, click on <span className="font-semibold text-[#5b8ef4]">New Application</span> and
                      provide a company and position.
                    </p>
                  </td>
                )}
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(row)}
                  style={{
                    cursor: onRowClick ? "pointer" : "default",
                    borderBottom: "1px solid #2d3748",
                  }}
                  className="hover:bg-[#141920] transition-colors group"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        width: column.width,
                      }}
                      className={`text-[#e8eaed] ${
                        "cell" in column ? "p-0" : "px-[14px] py-3"
                      }`}
                    >
                      {"cell" in column && column.cell(row)}
                      {!("cell" in column) && (
                        <div
                          style={{
                            width: column.width,
                            overflowX: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {String(
                            "key" in column
                              ? row[column.key as keyof T] || ""
                              : column.accessor(row) || "",
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ width: tableStyle?.width }}>
        {(useServerPagination || props.usePagination) && (
          <Paginator
            page={page}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
            totalItems={totalItems}
            paginatorContent={props.paginatorContent}
          />
        )}
      </div>
    </div>
  );
};

export default DataTable;