import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";
import { Application } from "../types/Application";

const Applications = () => {
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
        }}
        columns={[
          {
            header: "Company",
            accessorFn: (row) => row.companyName,
          },
          {
            header: "Position",
            accessorFn: (row) => row.position,
          },
          {
            header: "Location",
          },
          {
            header: "Link",
            accessorFn: (row) => row.link,
          },
          {
            header: "Status",
            accessorFn: (row) =>
              row.process ? row.process[row.process.length - 1].status : "",
          },
          {
            header: "Date Applied",
            accessorFn: (row) => (row.process ? row.process[0].date : ""),
          },
          {
            header: "Date Modified",
            accessorFn: (row) =>
              row.process ? row.process[row.process.length - 1].date : "",
          },
        ]}
        data={
          [
            {
              companyId: "1",
              companyName: "Google",
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
      />
    </div>
  );
};

export default Applications;
