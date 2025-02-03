import DataTable from "../components/DataTable";
import StatusBubble from "../components/StatusBubble";
import { ColumnDef } from "../types/ColumnDef";

interface Data {
  position: string;
  company: string;
  status: string[];
}

const applicationData = [
  {
    position: "SWE",
    company: "google",
    status: ["Applied", "Interviewing"],
  },
  {
    position: "SWE",
    company: "meta",
    status: ["Applied", "Interviewing"],
  },
  {
    position: "SWE",
    company: "google",
    status: ["Applied", "Interviewing"],
  },
  {
    position: "SWE",
    company: "meta",
    status: ["Applied"],
  },
  {
    position: "SWE",
    company: "google",
    status: ["Applied"],
  },
  {
    position: "SWE",
    company: "meta",
    status: ["Applied"],
  },
  {
    position: "SWE",
    company: "google",
    status: ["Applied", "Offer"],
  },
  {
    position: "SWE",
    company: "meta",
    status: ["Applied", "Rejected"],
  },
  {
    position: "SWE",
    company: "google",
    status: ["Applied", "Rejected"],
  },
  {
    position: "SWE",
    company: "meta",
    status: ["Applied", "Rejected"],
  },
  {
    position: "SWE",
    company: "google",
    status: ["Applied", "Rejected"],
  },
  {
    position: "SWE",
    company: "meta",
    status: ["Applied", "Rejected"],
  },
];

// const fetchData = async (page: number, perPage: number) => {
//   const data = {
//     page: page,
//     perPage: perPage,
//     total: 12,
//     data: applicationData.slice(page * perPage, (page + 1) * perPage),
//   };
//   return data; // Should be in the form { page, perPage, total, applications }
// };

const columns: ColumnDef<Data>[] = [
  { key: "position", header: "Job Position" },
  { accessor: (row) => row.company, header: "Company" },
  {
    key: "status",
    header: "Status",
    cell: (row) => {
      const status = row.status;
      return <StatusBubble status={status[status.length - 1]} />;
    },
    width: "200px",
  },
];

const Sandbox = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sandbox</h1>
      <DataTable
        columns={columns}
        // fetchData={fetchData}
        data={applicationData}
        usePagination={true}
        tableStyle={{ width: "500px" }}
      />
    </div>
  );
};

export default Sandbox;
