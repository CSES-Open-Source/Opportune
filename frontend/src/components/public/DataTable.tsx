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
  columns: ColumnDef<T>[]; // Definition of columns for react table
  useServerPagination?: boolean; // Set to true to toggle server side pagination
  usePagination?: boolean;
  onRowClick?: (row: T) => void; // Event emitter for row click
  tableStyle?: TableStyle;
}

interface DataTableNoPaginationProps<T extends object>
  extends BaseDataTableProps<T> {
  data: T[]; // data to display in table when the table is not paginated
  fetchData?: undefined;
  usePagination?: false;
  useServerPagination?: false; // Set to true to toggle server side pagination
}

interface DataTablePaginationProps<T extends object>
  extends BaseDataTableProps<T>,
    UsePagination {
  data: T[]; // data to display in table when the table is not paginated
  fetchData?: undefined;
  usePagination: true;
  useServerPagination?: false; // Set to true to toggle server side pagination
}

interface DataTableServerPaginationProps<T extends object>
  extends BaseDataTableProps<T>,
    UsePagination {
  data?: undefined;
  fetchData: (page: number, perPage: number) => Promise<PaginatedData<T>>; // function to fetch data when server side pagination is used (for now this table does not support client side pagination)
  usePagination?: true;
  useServerPagination: true; // Set to true to toggle server side pagination
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

  // Handle page change by slicing data for client side pagination
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

  // Handle page change by fetching data from backend for server side pagination
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
        }}
        className="overflow-auto border border-solid bg-white"
      >
        <table style={{ borderCollapse: "collapse" }} className="w-full">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={{
                    width: column.width,
                    overflowX: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  className="px-[14px] py-2 text-left border border-solid"
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
                  <ProgressSpinner className="h-16 w-16" strokeWidth="3" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                { pageType === "saved" ? (<td colSpan={columns.length} className="text-center">
                  <br></br>
                  <p>You have not saved any potential applications yet.</p>
                  <p>Click on <b> New Saved Application</b> to store an application you are still working on.</p>
                </td>) : (<td colSpan={columns.length} className="text-center">
                  <br></br>
                  <p>You have not made any applications yet.</p>
                  <p>To get started, click on <b> New Application</b> and provide a company and position.</p>
                </td>)
                }
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(row)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                  className="hover:bg-primary hover:bg-opacity-10 transition"
                >
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      style={{
                        width: column.width,
                      }}
                      className={`border border-solid ${
                        "cell" in column ? "p-0" : "px-[14px] py-2"
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
