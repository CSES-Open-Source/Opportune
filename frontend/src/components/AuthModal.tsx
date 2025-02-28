import { useAuth } from "../contexts/useAuth";
import Dialog from "./Dialog";
import Modal from "./Modal";

const AuthModal = () => {
  const {
    isAuthenticated,
    isLoading,
    isProfileComplete,
    error,
    clearAuthError,
    createUser,
    user,
  } = useAuth();

  // const onProfileComplete = (fromData) => {};

  if (isLoading) {
    return (
      <Modal isOpen={isLoading} disableClose={true} useOverlay={true}></Modal>
    );
  }

  if (error !== "") {
    return (
      <Dialog
        isDialogOpen={error != ""}
        onConfirm={clearAuthError}
        onDialogClose={clearAuthError}
        text={`Authentication Error: ${error}`}
        type="error"
      />
    );
  }

  if (!isProfileComplete) {
    return (
      <Modal isOpen={isLoading} disableClose={true} useOverlay={true}></Modal>
    );
  }

  return <></>;
};

export default AuthModal;
