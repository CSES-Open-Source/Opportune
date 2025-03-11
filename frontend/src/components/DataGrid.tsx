import { useEffect, useState } from "react";
import { PaginatedData } from "../types/PaginatedData";
import Paginator, { UsePagination } from "./Paginator";

interface GridStyle {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  gap?: string;
}

interface BaseDataGridProps<T> {
  TileComponent: React.ComponentType<{ data: T }>;
  cols: number; // Number of columns in the grid
  maxRows: number; // Maximum number of rows to display
  gridStyle?: GridStyle;
  useServerPagination?: boolean;
}

interface DataGridNoPaginationProps<T> extends BaseDataGridProps<T> {
  data: T[];
  usePagination?: false;
  useServerPagination?: false;
}

interface DataGridPaginationProps<T>
  extends BaseDataGridProps<T>,
    UsePagination {
  data: T[];
  usePagination: true;
  useServerPagination?: false;
}

interface DataGridServerPaginationProps<T>
  extends BaseDataGridProps<T>,
    UsePagination {
  fetchData: (page: number, perPage: number) => Promise<PaginatedData<T>>;
  useServerPagination: true;
}

type DataGridProps<T> =
  | DataGridNoPaginationProps<T>
  | DataGridPaginationProps<T>
  | DataGridServerPaginationProps<T>;

const DataGrid = <T extends object>(props: DataGridProps<T>) => {
  const { TileComponent, cols, maxRows, useServerPagination, gridStyle } =
    props;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(maxRows * cols);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Handle client-side pagination
  useEffect(() => {
    if (!useServerPagination) {
      const inputData = props.data;
      setLoading(true);

      if (props.usePagination) {
        setData(inputData.slice(page * perPage, (page + 1) * perPage));
        setTotalItems(inputData.length);
      } else {
        // If maxRows is specified and no pagination, still limit the display
        if (maxRows && inputData.length > maxRows * cols) {
          setData(inputData.slice(0, maxRows * cols));
        } else {
          setData(inputData);
        }
        setTotalItems(inputData.length);
      }

      setLoading(false);
    }
  }, [props, page, perPage, useServerPagination, maxRows, cols]);

  // Handle server-side pagination
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">Loading...</div>
    );
  }

  return (
    <div
      style={{ ...gridStyle }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Grid container */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: gridStyle?.gap || "1rem",
            padding: "1rem",
          }}
        >
          {data.map((item, index) => (
            <div key={index} className="card-wrapper">
              <TileComponent data={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {(useServerPagination || props.usePagination) && (
        <div className="mt-4">
          <Paginator
            page={page}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
            totalItems={totalItems}
            paginatorContent={props.paginatorContent}
          />
        </div>
      )}
    </div>
  );
};

export default DataGrid;
