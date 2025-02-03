interface ColumnDefBase {
  header: string;
  width?: string;
}

interface ColumnDefKey extends ColumnDefBase {
  key: string;
}

interface ColumnDefAccessor<T> extends ColumnDefBase {
  accessor: (row: T) => string;
}

interface ColumnDefCell<T> extends ColumnDefBase {
  cell: (row: T) => JSX.Element;
}

export type ColumnDef<T> =
  | ColumnDefKey
  | ColumnDefAccessor<T>
  | ColumnDefCell<T>;
