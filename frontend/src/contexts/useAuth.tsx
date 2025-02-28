// AuthContext.tsx
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import {
  getUserById,
  createUser as create,
  updateUser as update,
} from "../api/users";
import {
  ClassLevel,
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserType,
} from "../types/User";
import React, { createContext, useEffect, useState } from "react";

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  error: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  createUser: (newUser: CreateUserRequest) => void;
  updateUser: (updates: UpdateUserRequest) => void;
  clearAuthError: () => void;
  isProfileComplete: boolean;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  error: "",
  login: async () => {},
  logout: async () => {},
  isAuthenticated: () => false,
  createUser: () => {},
  updateUser: () => {},
  clearAuthError: () => {},
  isProfileComplete: true,
  isLoading: false,
});

// Helper function to check if user profile is complete
const checkProfileComplete = (user: User | null): boolean => {
  if (!user) return false;

  // Add all required fields that need to be checked here
  // For example: name, email, phone, etc.
  return !!(
    user.name &&
    user.email &&
    // Add any other required fields
    true
  );
};

// Create the provider component
export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth listener on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      if (firebaseUser) {
        // Try to get user from our backend
        getUserById(firebaseUser.uid)
          .then((response) => {
            if (response.success) {
              // User exists in our backend
              const userData = {
                ...response.data,
                profilePicture: firebaseUser.photoURL || "",
              };
              setUser(userData);

              // Check if profile is complete
              setIsProfileComplete(checkProfileComplete(userData));
            } else {
              const newUser: User = {
                _id: firebaseUser.uid,
                email: firebaseUser.email || "",
                name: firebaseUser.displayName || "",
                profilePicture: firebaseUser.photoURL || "",
                type: UserType.Student,
                major: "",
                classLevel: ClassLevel.Freshmen,
              };
              setIsProfileComplete(false);
              setUser(newUser);
            }
          })
          .catch((err) => {
            console.error("Error fetching user data:", err);
            setError("Failed to load user data");
          });
      } else {
        // User is not authenticated
        setUser(null);
        setIsProfileComplete(true); // Reset this when logged out
      }

      setIsLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (error !== "") {
      // TODO: Display error modal
    }
  }, [error]);

  // Google sign-in function
  const login = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // The auth state listener will handle the rest
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // The auth state listener will handle setting user to null
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during logout");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (newUser: CreateUserRequest) => {
    if (user && !isProfileComplete) {
      setIsLoading(true);
      create(newUser)
        .then((response) => {
          if (response.success) {
            setUser({ ...response.data, profilePicture: user.profilePicture });
            setIsProfileComplete(true);
          } else {
            setError(response.error);
          }
        })
        .catch((err) => {
          console.error("Error updating profile:", err);
          setError("An error occurred while updating your profile");
        });
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: UpdateUserRequest) => {
    if (isAuthenticated() && user) {
      setIsLoading(true);
      update(user._id, updates)
        .then((response) => {
          if (response.success) {
            setUser({ ...response.data, profilePicture: user.profilePicture });
          } else {
            setError(response.error);
          }
        })
        .then((err) => {
          console.error("Error updating profile:", err);
          setError("An error occurred while updating your profile");
        });
      setIsLoading(false);
    }
  };

  const isAuthenticated = (): boolean => {
    return user != null && isProfileComplete;
  };

  const clearAuthError = (): void => {
    setError("");
  };

  // Create the value object for the context
  const value = {
    user,
    error,
    login,
    logout,
    isAuthenticated,
    createUser,
    updateUser,
    clearAuthError,
    isProfileComplete,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
