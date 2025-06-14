import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';

function OAuth() {

    const handleGoogleClick = async() => {
        try {
           const provider = new GoogleAuthProvider()
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    image: result.user.photoURL,
                }),
                
            })  
            const data = await res.json();
        } catch (error) {
            console.log('Could not sign in with Google: ', error);
            
            
        }
    };

  return (
      <button onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg hover:opacity-95 transition-all duration-300 uppercase'>Continue With Google</button> 
    )
}

export default OAuth