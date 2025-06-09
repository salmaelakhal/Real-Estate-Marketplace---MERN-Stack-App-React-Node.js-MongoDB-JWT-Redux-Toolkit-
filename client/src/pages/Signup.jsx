import React from 'react'
import { Link } from 'react-router-dom';
export default function Signup() {
  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4 w-96 mx-auto'>
        <input type="text" placeholder="Username" className="border p-3 rounded-lg bg-white" id='username' />
        <input type="email" placeholder="Email" className="border p-3 rounded-lg bg-white" id='email' />
          <input type="password" placeholder="Password" className="border p-3 rounded-lg bg-white" id='password' />
          
          <button className='bg-slate-700 text-white p-3 rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:oppacity-80 uppercase'>Sign Up</button>
          <button className='bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all duration-300 uppercase'>Continue With Google</button>
          <div className='flex gap-2 mt-5'>
            <p className='text-start text-gray-500'> Already have an account?</p>
            <Link to={"/sign-in"}>
              <span  className='text-blue-500'> Sign In</span>
            </Link>

          </div>
        </form>
        
      </div>
     
    </>
  )
}

 