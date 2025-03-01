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
import { APIResult } from "../api/requests";

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  error: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  createUser: (newUser: CreateUserRequest) => Promise<APIResult<User>>;
  updateUser: (updates: UpdateUserRequest) => Promise<APIResult<User>>;
  clearAuthError: () => void;
  isProfileComplete: boolean;
  setIsProfileComplete: (isProfileComplete: boolean) => void;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  error: "",
  login: async () => {},
  logout: async () => {},
  isAuthenticated: () => false,
  createUser: (): Promise<APIResult<User>> => {
    return Promise.resolve({ success: false, error: "User not authenticated" });
  },
  updateUser: (): Promise<APIResult<User>> => {
    return Promise.resolve({ success: false, error: "User not authenticated" });
  },
  clearAuthError: () => {},
  isProfileComplete: true,
  setIsProfileComplete: () => {},
  isLoading: false,
});

// Helper function to check if user profile is complete
const checkProfileComplete = (user: User | null): boolean => {
  if (!user) return false;
  return !!(
    user.name &&
    user.email &&
    Object.values(UserType).includes(user.type)
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
        getUserById(firebaseUser.uid)
          .then((response) => {
            if (response.success) {
              // User exists in backend
              const userData = {
                ...response.data,
                profilePicture: firebaseUser.photoURL || "",
              };
              setUser(userData);
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

  const createUser = async (
    newUser: CreateUserRequest,
  ): Promise<APIResult<User>> => {
    if (user && !isProfileComplete) {
      setIsLoading(true);
      try {
        const response = await create(newUser);

        if (response.success) {
          setUser({ ...response.data, profilePicture: user.profilePicture });
        } else {
          setError(response.error);
        }

        return response;
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("An error occurred while creating your profile");
        return {
          success: false,
          error: "An error occurred while creating your profile",
        };
      } finally {
        setIsLoading(false);
      }
    }
    return { success: false, error: "User not authenticated" };
  };

  const updateUser = async (
    updates: UpdateUserRequest,
  ): Promise<APIResult<User>> => {
    if (isAuthenticated() && user) {
      setIsLoading(true);
      try {
        const response = await update(user._id, updates);

        if (response.success) {
          setUser({ ...response.data, profilePicture: user.profilePicture });
        } else {
          setError(response.error);
        }

        return response;
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("An error occurred while creating your profile");
        return {
          success: false,
          error: "An error occurred while creating your profile",
        };
      } finally {
        setIsLoading(false);
      }
    }
    return { success: false, error: "User not authenticated" };
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
    setIsProfileComplete,
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
