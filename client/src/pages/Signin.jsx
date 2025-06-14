import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';



export default function SignIn() {
  const [formData, setFormData] = React.useState({});
  const {loading, error} = useSelector((state) => state.user); // Si tu utilises Redux pour gérer l'état de l'utilisateur

  const navigate = useNavigate(); // ✅ ici
  const dispatch = useDispatch(); // Si tu veux utiliser Redux pour gérer l'état de l'utilisateur
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart()); // Si tu utilises Redux pour gérer l'état de l'utilisateur 
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json(); 
      console.log("Données reçues de l'API :", data);

      if (data.success === false) {
        dispatch(signInFailure(data.message)); // Si tu utilises Redux pour gérer l'état de l'utilisateur 
        return;
      }

      dispatch(signInSuccess(data)); // Si tu utilises Redux pour gérer l'état de l'utilisateur
      navigate("/"); // ✅ utilise bien le hook
      console.log(data);

    } catch (error) {
      dispatch(signInFailure(error.message)); // Si tu utilises Redux pour gérer l'état de l'utilisateur
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-96 mx-auto'>
        <input type="email" placeholder="Email" className="border p-3 rounded-lg bg-white" id='email' onChange={handleChange} />
        <input type="password" placeholder="Password" className="border p-3 rounded-lg bg-white" id='password' onChange={handleChange} />

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg hover:bg-slate-800 transition-all duration-300 disabled:opacity-80 uppercase'>
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />

        {/* <button className='bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all duration-300 uppercase'>Continue With Google</button> */}
      </form>

      <div className='ml-14 flex gap-2 mt-5'>
        <p className='text-gray-500'>Don't have an account?</p>
        <Link to="/sign-up">
          <span className='text-blue-500'>Sign Up</span>
        </Link>
      </div>

      {error && <p className='text-red-500 text-center mt-5'>{error}</p>}
    </div>
  );
}
