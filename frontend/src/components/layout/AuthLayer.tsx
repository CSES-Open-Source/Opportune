import Layout from "./Layout";
import AuthModal from "../auth/AuthModal";

const AuthLayer = () => {
  return (
    <div className="overflow-x-hidden">
      <Layout />
      <AuthModal />
    </div>
  );
};

export default AuthLayer;