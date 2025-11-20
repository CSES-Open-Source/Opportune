import { useEffect, useState } from "react";
import { PaginatedData } from "../../types/PaginatedData";
import Paginator, { UsePagination } from "./Paginator";
import { ProgressSpinner } from "primereact/progressspinner";

interface ListStyle {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}

interface BaseDataListProps<T> {
  data?: T[];
  pageType: string;
  fetchData?: (page: number, perPage: number) => Promise<PaginatedData<T>>;
  TileComponent: React.ComponentType<{ data: T }>; // Custom tile component to display each item
  useServerPagination?: boolean; // Toggle server-side pagination
  usePagination?: boolean;
  listStyle?: ListStyle; // Style for the DataList container
  listClassName?: string;
}

interface DataListNoPaginationProps<T> extends BaseDataListProps<T> {
  data: T[]; // Data to display when not using server pagination
  fetchData?: undefined;
  usePagination?: false;
  useServerPagination?: false; // Toggle server-side pagination
}

interface DataListPaginationProps<T>
  extends BaseDataListProps<T>,
    UsePagination {
  data: T[]; // Data to display when not using server pagination
  fetchData?: undefined;
  usePagination: true;
  useServerPagination?: false; // Toggle server-side pagination
}

interface DataListServerPaginationProps<T>
  extends BaseDataListProps<T>,
    UsePagination {
  data?: undefined;
  fetchData: (page: number, perPage: number) => Promise<PaginatedData<T>>; // Function to fetch data for server pagination
  usePagination?: undefined;
  useServerPagination: true; // Enable server-side pagination
  listStyle?: ListStyle; // Style for the DataList container
}

type DataListProps<T> =
  | DataListNoPaginationProps<T>
  | DataListPaginationProps<T>
  | DataListServerPaginationProps<T>;

const DataList = <T extends object>(props: DataListProps<T>) => {
  const { TileComponent, useServerPagination, listStyle, listClassName, pageType } =
    props;

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
  }, [props.data, props.usePagination, page, perPage, useServerPagination]);

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

  return (
    <div style={listStyle} className="flex flex-col h-full">
      {/* 1) scrollable list region */}

      {data.length > 0 ? <div className={`flex-1 overflow-y-auto ${listClassName ?? ""}`}>
        {data.map((item, i) => (
          <TileComponent key={i} data={item} />
        ))}</div> : pageType === "companies" ?
        <div className="text-center">
          <br></br>
          <p>No companies currently match your query.</p>
          <p>Edit your <b>Filter</b> or <b>Add</b> more entries to receive results.</p>
          <p></p>
        </div> :
        <div className="text-center">
          <br></br>
          <p>No alumni currently fit your query.</p>
          <p>Edit your <b>Industry</b> type to find alumni in a different category.</p>
          <p></p>
        </div>
      }

      {/* 2) paginator "below" the scroll region */}
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

export default DataList;