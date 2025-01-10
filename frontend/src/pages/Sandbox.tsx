import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

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

interface StatusBubbleProps {
  status: string;
}

const StatusBubble = ({ status }: StatusBubbleProps) => {
  // Define color styles based on status
  const statusColors: Record<string, string> = {
    applied: "bg-green-200 text-green-800",
    interviewing: "bg-yellow-200 text-yellow-800",
    offer: "bg-blue-200 text-blue-800",
    rejected: "bg-red-200 text-red-800",
  };

  // Default to gray if status is unknown
  const colorClass =
    statusColors[status.toLowerCase()] || "bg-gray-200 text-gray-800";

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${colorClass}`}
    >
      {status}
    </span>
  );
};

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
  { accessorKey: "position", header: "Job Position", size: 200 },
  { accessorKey: "company", header: "Company" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<string[]>();
      return <StatusBubble status={status[status.length - 1]} />;
    },
    size: 100,
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
        tableStyle={{ height: "500px", width: "500px" }}
      />
    </div>
  );
};

export default Sandbox;
