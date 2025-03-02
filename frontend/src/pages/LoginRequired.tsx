import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../contexts/useAuth";

const LoginRequired: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="flex w-[100vw] items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Login Required
        </h2>
        <p className="text-gray-600 mb-6">
          {
            "You need to be logged in to access this page. Please log in using your UCSD email account."
          }
        </p>
        <div className="h-[65px] py-1 px-2 flex items-center">
          <button
            className={
              "h-full w-full text-lg flex items-center rounded-lg font-medium px-3 gap-3 transition justify-center border shadow-md hover:bg-black hover:bg-opacity-[0.03] hover:shadow-lg"
            }
            onClick={login}
          >
            <FcGoogle size={28} />
            <div>Sign in with Google</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequired;
