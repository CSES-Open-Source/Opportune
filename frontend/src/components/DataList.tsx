import { useEffect, useState } from "react";
import { PaginatedData } from "../types/PaginatedData";
import Paginator, { UsePagination } from "./Paginator";

interface ListStyle {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}

interface BaseDataListProps<T> {
  TileComponent: React.ComponentType<{ data: T }>; // Custom tile component to display each item
  useServerPagination?: boolean; // Toggle server-side pagination
  listStyle?: ListStyle; // Style for the DataList container
}

interface DataListNoPaginationProps<T> extends BaseDataListProps<T> {
  data: T[]; // Data to display when not using server pagination
  usePagination?: false;
  useServerPagination?: false; // Toggle server-side pagination
}

interface DataListPaginationProps<T>
  extends BaseDataListProps<T>,
    UsePagination {
  data: T[]; // Data to display when not using server pagination
  usePagination: true;
  useServerPagination?: false; // Toggle server-side pagination
}

interface DataListServerPaginationProps<T>
  extends BaseDataListProps<T>,
    UsePagination {
  fetchData: (page: number, perPage: number) => Promise<PaginatedData<T>>; // Function to fetch data for server pagination
  useServerPagination: true; // Enable server-side pagination
  listStyle?: ListStyle; // Style for the DataList container
}

type DataListProps<T> =
  | DataListNoPaginationProps<T>
  | DataListPaginationProps<T>
  | DataListServerPaginationProps<T>;

const DataList = <T extends object>(props: DataListProps<T>) => {
  const { TileComponent, useServerPagination, listStyle } = props;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
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
        setLoading(false);
      } else {
        setData(inputData);
        setTotalItems(inputData.length);
        setLoading(false);
      }
    }
  }, [props, page, perPage, useServerPagination]);

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

  // TODO: style loading with spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ ...listStyle, overflowY: "auto" }}>
      <div className="flex flex-col gap-4">
        {data.map((item, index) => (
          <TileComponent key={index} data={item} />
        ))}
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

export default DataList;
