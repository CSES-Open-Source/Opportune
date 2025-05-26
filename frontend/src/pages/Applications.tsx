import { useCallback, useState } from "react";
import { getApplicationsByUserID } from "../api/applications";
import DataTable from "../components/public/DataTable";
import SearchBar from "../components/public/SearchBar";
import StatusBubble from "../components/public/StatusBubble";
import { statusColors } from "../constants/statusColors";
import { Application } from "../types/Application";
import { ColumnDef } from "../types/ColumnDef";
import { PaginatedData } from "../types/PaginatedData";
import { useAuth } from "../contexts/useAuth";
import NewApplicationModal from "../components/application/NewApplicationModal";
import ApplicationModal from "../components/application/ApplicationModal";

const applicationColumns: ColumnDef<Application>[] = [
  {
    header: "Company",
    cell: (row) => {
      return (
        <div className="flex flex-row items-center">
          <div
            className={`w-[6px] h-[40.57px] mr-2 bg-opacity-60 ${
              statusColors[
                row.process && row.process.length > 0
                  ? row.process[row.process.length - 1].status
                  : ""
              ]
            }`}
          />
          {row.company.name}
        </div>
      );
    },
  },
  {
    header: "Position",
    key: "position",
  },
  {
    header: "Location",
    key: "location",
  },
  {
    header: "Link",
    key: "link",
    width: "100px",
  },
  {
    header: "Status",
    cell: (row) => (
      <StatusBubble
        status={
          row.process && row.process.length > 0
            ? row.process[row.process.length - 1].status
            : "NONE"
        }
      />
    ),
  },
  {
    header: "Date Applied",
    accessor: (row) =>
      row.process && row.process.length > 0
        ? row.process[0].date.toLocaleDateString()
        : "",
  },
  {
    header: "Date Updated",
    accessor: (row) =>
      row.process && row.process.length > 0
        ? row.process[row.process.length - 1].date.toLocaleDateString()
        : "",
  },
];

interface SearchBarData extends Record<string, string | string[]> {
  query: string;
  sortBy: string[];
  status: string[];
}

const Applications = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState<SearchBarData>({
    query: "",
    sortBy: [],
    status: [],
  });

  const [newApplicationOpen, setNewApplicationOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application>({
    _id: "",
    userId: "",
    company: { _id: "", name: "" },
    position: "",
  });
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);

  // Fetch paginated applications whenever search options change
  const getPaginatedApplications = useCallback(
    async (page: number, perPage: number) => {
      if (!user) {
        return {
          page: 0,
          perPage: 0,
          total: 0,
          data: [],
        } as PaginatedData<Application>;
      }

      const res = await getApplicationsByUserID(user._id, {
        page: page,
        perPage: perPage,
        query: search.query.length >= 1 ? search.query : undefined,
        sortBy:
          search.sortBy.length === 1
            ? search.sortBy[0].toUpperCase()
            : undefined,
        status: search.status.length >= 1 ? search.status.join(",") : undefined,
      });

      if (res.success) {
        return {
          ...res.data,
          // Convert ISO date strings to locale date strings
          data: res.data.data.map((app) => ({
            ...app,
            process:
              app.process &&
              app.process.map((proc) => ({
                ...proc,
                date: new Date(proc.date),
              })),
          })),
        };
      } else {
        console.error(res.error);

        return {
          page: 0,
          perPage: 0,
          total: 0,
          data: [],
        } as PaginatedData<Application>;
      }
    },
    [search, user],
  );

  const onApplicationClicked = (application: Application) => {
    setSelectedApplication(application);
    setApplicationModalOpen(true);
  };

  const onApplicationModalClosed = () => {
    setApplicationModalOpen(false);
    setSelectedApplication({
      _id: "",
      userId: "",
      company: { _id: "", name: "" },
      position: "",
    });
  };

  const onNewApplicationClicked = () => {
    setNewApplicationOpen(true);
  };

  return (
    <div className="flex flex-col gap-5 px-6 py-4">
      <h1 className="text-3xl font-bold">Applications</h1>
      <SearchBar<SearchBarData>
        selections={[
          {
            label: "Sort By",
            options: ["Applied", "Modified", "Status", "Company", "Position"],
            single: true,
          },
          {
            label: "Status",
            options: ["Applied", "OA", "Phone", "Final", "Offer", "Rejected"],
          },
        ]}
        onSubmitForm={setSearch}
      />
      <DataTable<Application>
        tableStyle={{
          width: "100%",
          height: "72vh",
        }}
        useServerPagination
        paginatorContent={{ setPerPage: true, goToPage: true }}
        columns={applicationColumns}
        fetchData={getPaginatedApplications}
        onRowClick={onApplicationClicked}
      />
      <button
        onClick={onNewApplicationClicked}
        className="px-4 py-3 absolute right-10 bottom-6 bg-accent-pink text-white rounded-md hover:opacity-90 font-medium transition"
      >
        New Application
      </button>
      <NewApplicationModal
        isOpen={newApplicationOpen}
        onClose={() => setNewApplicationOpen(false)}
        onNewApplication={() => setSearch({ ...search })}
      />
      <ApplicationModal
        isOpen={applicationModalOpen}
        onClose={onApplicationModalClosed}
        application={selectedApplication}
        setApplication={setSelectedApplication}
        onSaveApplication={() => setSearch({ ...search })}
      />
    </div>
  );
};

export default Applications;
