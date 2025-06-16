import React from 'react'
import { useSelector } from 'react-redux';

function Profile() {


  const { currentUser } = useSelector((state) => state.user);


  return (
    <div className = "p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-8'>Profile</h1>

      <form action="" className='flex flex-col items-center gap-4'>
        <img src={currentUser?.avatar} alt="" profile className='rounded-full w-24 h-24 object-cover self-center cursor-pointer mt-2'  />
        <input id='username' type="text" placeholder='username' className='border p-3 rounded-lg bg-white w-xl' value={currentUser.username}/>
        <input id='email' type="email" placeholder='email' className='border p-3 rounded-lg bg-white w-xl' value={currentUser.email}/>
        <input id='password' type="password" placeholder='password' className='border p-3 rounded-lg bg-white w-xl' value={currentUser.password} />
        <button className='bg-blue-700 text-white p-3 rounded-lg w-xl uppercase hover:opacity-95 disabled:opacity-80'>UPDATE</button>

      </form>
      
      <div className='justify-between items-center flex mt-4'>
        <span className='text-red-500 cursor-pointer '>Delete account</span>
        <span className='text-red-500 cursor-pointer'>Sign out</span>
      </div>
      </div>
  )
}

export default Profile