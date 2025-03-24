import DataGrid from "../components/DataGrid";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: "active" | "inactive";
}

// Custom card component for users
const UserCard = ({ data }: { data: User }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
      {/* Card header with avatar and name */}
      <div className="bg-gray-50 p-4 flex items-center border-b">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
          {data.avatar ? (
            <img
              src={data.avatar}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">{data.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg">{data.name}</h3>
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              data.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>

      {/* Card body with user details */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-gray-500">Email:</span>
          <div className="truncate">{data.email}</div>
        </div>
        <div className="mb-2">
          <span className="text-gray-500">Role:</span>
          <div>{data.role}</div>
        </div>
        <div className="mt-4">
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const Sandbox = () => {
  const users: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
      avatar: "",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      status: "active",
      avatar: "",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Viewer",
      status: "inactive",
      avatar: "",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      role: "Admin",
      status: "active",
      avatar: "",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Editor",
      status: "active",
      avatar: "",
    },
    {
      id: 6,
      name: "Diana Prince",
      email: "diana@example.com",
      role: "Viewer",
      status: "inactive",
      avatar: "",
    },
    {
      id: 7,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
      avatar: "",
    },
    {
      id: 8,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      status: "active",
      avatar: "",
    },
    {
      id: 9,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Viewer",
      status: "inactive",
      avatar: "",
    },
    {
      id: 10,
      name: "Alice Williams",
      email: "alice@example.com",
      role: "Admin",
      status: "active",
      avatar: "",
    },
    {
      id: 11,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Editor",
      status: "active",
      avatar: "",
    },
    {
      id: 12,
      name: "Diana Prince",
      email: "diana@example.com",
      role: "Viewer",
      status: "inactive",
      avatar: "",
    },
    {
      id: 13,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Editor",
      status: "active",
      avatar: "",
    },
    {
      id: 14,
      name: "Diana Prince",
      email: "diana@example.com",
      role: "Viewer",
      status: "inactive",
      avatar: "",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Directory</h1>

      <DataGrid<User>
        data={users}
        TileComponent={UserCard}
        cols={3}
        maxRows={4}
        usePagination={true}
        gridStyle={{
          height: "750px",
          maxWidth: "1200px",
          gap: "1.5rem",
        }}
      />
    </div>
  );
};

export default Sandbox;
