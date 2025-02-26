import * as React from "react";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig';
import { FirebaseError } from "firebase/app";


export default function Landing() {
  const [user, setUser] = React.useState<{ name: string | null; email: string | null } | null>(null);
  const [error, setError] = React.useState("");

  const handleGoogle = async () => {
    const provider = await new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser({ name: result.user.displayName, email: result.user.email });
    }
    catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <button onClick={handleGoogle}>Sign in with Google</button>

      {user && (
        <div>
          <h3>Welcome, {user.name}</h3>
          <p>Email: {user.email}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};