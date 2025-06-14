import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess, signInFailure, signInStart } from '../redux/user/userSlice';

function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    dispatch(signInStart());
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const user = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        googleId: result.user.uid,
      };

      console.log("Google user info:", user);

      // Envoyer au backend pour création ou mise à jour en base
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        dispatch(signInFailure(data.message || "Google auth failed"));
      }

    } catch (error) {
      console.log("Google sign-in error:", error);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      className='bg-red-700 text-white p-3 rounded-lg hover:opacity-95 transition-all duration-300 uppercase'
    >
      Continue With Google
    </button>
  );
}

export default OAuth;
