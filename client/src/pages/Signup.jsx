import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function Signup() {
  const [formData, setFormData] = React.useState({});
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate(); // ✅ ici

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json(); 
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate("/sign-in"); // ✅ utilise bien le hook
      console.log(data);

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-96 mx-auto'>
        <input type="text" placeholder="Username" className="border p-3 rounded-lg bg-white" id='username' onChange={handleChange} />
        <input type="email" placeholder="Email" className="border p-3 rounded-lg bg-white" id='email' onChange={handleChange} />
        <input type="password" placeholder="Password" className="border p-3 rounded-lg bg-white" id='password' onChange={handleChange} />

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg hover:bg-slate-800 transition-all duration-300 disabled:opacity-80 uppercase'>
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />

        {/* <button className='bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all duration-300 uppercase'>Continue With Google</button> */}
      </form>

      <div className='ml-14 flex gap-2 mt-5'>
        <p className='text-gray-500'>Already have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-500'>Sign In</span>
        </Link>
      </div>

      {error && <p className='text-red-500 text-center mt-5'>{error}</p>}
    </div>
  );
}
