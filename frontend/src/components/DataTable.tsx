/**
 * DataTable component implemented using @tanstack/react-table, for more information visit https://tanstack.com/table/latest
 */
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { PaginatedData } from "../types/PaginatedData";
import Paginator, { UsePagination } from "./Paginator";

interface TableStyle {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}

interface BaseDataTableProps<T extends object> {
  columns: ColumnDef<T, unknown>[]; // Definition of columns for react table
  useServerPagination?: boolean; // Set to true to toggle server side pagination
  onRowClick?: (row: T) => void; // Event emitter for row click
  tableStyle?: TableStyle;
}

interface DataTableNoPaginationProps<T extends object>
  extends BaseDataTableProps<T> {
  data: T[]; // data to display in table when the table is not paginated
  usePagination?: false;
  useServerPagination?: false; // Set to true to toggle server side pagination
}

interface DataTablePaginationProps<T extends object>
  extends BaseDataTableProps<T>,
    UsePagination {
  data: T[]; // data to display in table when the table is not paginated
  usePagination: true;
  useServerPagination?: false; // Set to true to toggle server side pagination
}

interface DataTableServerPaginationProps<T extends object>
  extends BaseDataTableProps<T>,
    UsePagination {
  fetchData: (page: number, perPage: number) => Promise<PaginatedData<T>>; // function to fetch data when server side pagination is used (for now this table does not support client side pagination)
  useServerPagination: true; // Set to true to toggle server side pagination
}

type DataTableProps<T extends object> =
  | DataTableNoPaginationProps<T>
  | DataTablePaginationProps<T>
  | DataTableServerPaginationProps<T>;

const DataTable = <T extends object>(props: DataTableProps<T>) => {
  const { columns, onRowClick, tableStyle, useServerPagination } = props;

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
  }, [props, page, perPage, useServerPagination]);

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
  }, [page, perPage, props, useServerPagination]);

  // Create react-table instance
  const table = useReactTable<T>({
    data,
    columns,
    pageCount: Math.ceil(totalItems / perPage), // Required for server-side pagination
    state: {
      pagination: {
        pageIndex: page,
        pageSize: perPage,
      },
    },
    onPaginationChange: (updater) => {
      // 'updater' can be a function or an object
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex: page, pageSize: perPage })
          : updater;
      setPage(newState.pageIndex);
      setPerPage(newState.pageSize);
    },
    manualPagination: true, // Enable manual pagination for server-side
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // TODO: Render spinner when loading async data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="table">
      <div style={tableStyle} className="overflow-y-auto">
        <table
          style={{ width: tableStyle?.width, maxWidth: tableStyle?.maxWidth }}
          className="border-collapse border border-gray-200"
        >
          {/* Generate Headers (Column names) */}
          <thead className="bg-gray-100 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b p-2 text-left"
                    style={{
                      width: header.column.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Generate Table Body */}
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100"
                onClick={() => onRowClick && onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b p-2"
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
  );
};

export default DataTable;
