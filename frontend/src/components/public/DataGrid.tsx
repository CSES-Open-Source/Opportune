import { useEffect, useState } from "react";
import { PaginatedData } from "../../types/PaginatedData";
import Paginator, { UsePagination } from "./Paginator";
import { ProgressSpinner } from "primereact/progressspinner";

interface GridStyle {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  gap?: string;
}

interface BaseDataGridProps<T> {
  data?: T[];
  fetchData?: (page: number, perPage: number) => Promise<PaginatedData<T>>;
  TileComponent: React.ComponentType<{ data: T }>;
  onTileClicked?: (row: T) => void; // event emitter for item click
  cols: number; // Number of columns in the grid
  maxRows?: number; // Maximum number of rows to display
  gridStyle?: GridStyle;
  className?: string;
  useServerPagination?: boolean;
  usePagination?: boolean;
}

interface DataGridNoPaginationProps<T> extends BaseDataGridProps<T> {
  data: T[];
  fetchData?: undefined;
  usePagination?: false;
  useServerPagination?: false;
}

interface DataGridPaginationProps<T>
  extends BaseDataGridProps<T>,
    UsePagination {
  data: T[];
  fetchData?: undefined;
  usePagination: true;
  useServerPagination?: false;
}

interface DataGridServerPaginationProps<T>
  extends BaseDataGridProps<T>,
    UsePagination {
  data?: undefined;
  fetchData: (page: number, perPage: number) => Promise<PaginatedData<T>>;
  usePagination?: undefined;
  useServerPagination: true;
}

type DataGridProps<T> =
  | DataGridNoPaginationProps<T>
  | DataGridPaginationProps<T>
  | DataGridServerPaginationProps<T>;

const DataGrid = <T extends object>(props: DataGridProps<T>) => {
  const {
    TileComponent,
    onTileClicked,
    cols,
    maxRows,
    useServerPagination,
    className = "",
    gridStyle,
  } = props;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(maxRows ? maxRows * cols : 9);
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
  }, [
    props.data,
    props.usePagination,
    page,
    perPage,
    useServerPagination,
    maxRows,
    cols,
  ]);

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
  }, [page, perPage, props.fetchData, useServerPagination]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ProgressSpinner className="h-16 w-16" strokeWidth="3" />
      </div>
    );
  }

  const handleTileClick = (tile: T) => {
    if (onTileClicked) {
      onTileClicked(tile);
    }
  };

  return (
    <div
      style={{ ...gridStyle, gap: 0 }}
      className={`flex flex-col h-full overflow-hidden ${className}`}
    >
      {/* Grid container */}
      <div className={useServerPagination ? "flex-1" : "flex-1 overflow-y-auto"}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: gridStyle?.gap || "1rem",
          }}
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="card-wrapper"
              onClick={() => handleTileClick(item)}
            >
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
