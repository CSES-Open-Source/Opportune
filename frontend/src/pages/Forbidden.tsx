const Forbidden: React.FC = () => {
  return (
    <div className="flex w-[100vw] items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-9xl font-bold text-red-500">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Access Forbidden
        </h2>
        <p className="text-gray-600 mb-6">
          {
            "Sorry, you don't have permission to access this page. Please make sure you have the necessary permissions or contact the administrator if you believe this is an error."
          }
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default Forbidden;
