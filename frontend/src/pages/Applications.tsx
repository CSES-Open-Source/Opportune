import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";
import StatusBubble from "../components/StatusBubble";
import { statusColors } from "../constants/statusColors";
import { Application } from "../types/Application";
import { ColumnDef } from "../types/ColumnDef";

const applicationColumns: ColumnDef<Application>[] = [
  {
    header: "Company",
    cell: (row) => {
      return (
        <div className="flex flex-row items-center">
          <div
            className={`w-[6px] h-[40.57px] mr-2 ${
              statusColors[
                row.process ? row.process[row.process.length - 1].status : ""
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
          row.process ? row.process[row.process.length - 1].status : "None"
        }
      />
    ),
  },
  {
    header: "Date Applied",
    accessor: (row) =>
      row.process ? row.process[0].date.toLocaleString() : "",
  },
  {
    header: "Date Modified",
    accessor: (row) =>
      row.process
        ? row.process[row.process.length - 1].date.toLocaleString()
        : "",
  },
];

const Applications = () => {
  const onApplicationClicked = (application: Application) => {
    // TODO: Toggle modal for view application details
    console.log(application);
  };

  const onNewApplicationClicked = () => {
    // TODO: Toggle modal for new application
    console.log("New application!");
  };

  return (
    <div className="flex flex-col gap-5 px-6 py-4">
      <h1 className="text-3xl font-bold">Applications</h1>
      <SearchBar
        selections={[
          {
            label: "Sort By",
            options: ["Applied", "Modified", "Status", "Company", "Position"],
          },
          {
            label: "Status",
            options: ["Applied", "OA", "Phone", "Final", "Offer", "Rejected"],
          },
        ]}
      />
      <DataTable<Application>
        tableStyle={{
          width: "100%",
          height: "72vh",
        }}
        usePagination
        columns={applicationColumns}
        data={
          [
            {
              company: {
                _id: "123",
                name: "Google",
                city: "Mountain View",
                state: "California",
              },
              position: "Software Engineer",
              userId: "1",
              link: "https://www.google.com",
              process: [
                {
                  status: "Applied",
                  date: "2021-09-01",
                },
                {
                  status: "OA",
                  date: "2021-09-05",
                },
              ],
            },
          ] as Application[]
        }
        onRowClick={onApplicationClicked}
      />
      <button
        onClick={onNewApplicationClicked}
        className="px-4 py-3 absolute right-10 bottom-6 bg-accent-pink text-white rounded-md hover:opacity-90 font-medium"
      >
        New Application
      </button>
    </div>
  );
};

export default Applications;
