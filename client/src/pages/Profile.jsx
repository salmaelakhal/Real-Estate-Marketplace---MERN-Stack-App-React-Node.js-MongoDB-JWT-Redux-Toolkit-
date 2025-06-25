import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserFailure,
  signOutUserSuccess
} from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadMessage, setFileUploadMessage] = useState('');
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '',
    avatar: currentUser.avatar || ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error' | ''
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);





  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '',
        avatar: currentUser.avatar || '',
      });
    }
  }, [currentUser]);
  

  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImageToCloudinary = async (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'e5v6bwbz');
  
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/drkevbsa1/image/upload',
        form,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          },
        }
      );
  
      const data = res.data;
  
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
        setFileUploadMessage('✅ Image uploaded successfully');
      } else {
        setFileUploadMessage('❌ Failed to upload image');
      }
    } catch (err) {
      console.error('Cloudinary Error:', err);
      setFileUploadMessage('❌ Error uploading image');
    } finally {
      setUploadProgress(0); // reset progress
    }
  };
  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      formData.username === currentUser.username &&
      formData.email === currentUser.email &&
      formData.avatar === currentUser.avatar &&
      formData.password === ''
    ) {
      setMessageType('error');
      setMessage('Aucune modification détectée.');
      return;
    }
  
    dispatch(updateUserStart());
    setMessage('');
  
    try {
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setMessageType('error');
        setMessage(data.message || 'Erreur lors de la mise à jour.');
        return;
      }
  
      dispatch(updateUserSuccess(data.user));
      setMessageType('success');
      setMessage('Profil mis à jour avec succès.');
    } catch (err) {
      dispatch(updateUserFailure(err.message));
      setMessageType('error');
      setMessage('Erreur serveur. Veuillez réessayer.');
    }
  };
  
  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`, // ✅ Ajout du token
        },
      });
  
      const data = await res.json();
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
  
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };
  

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
  
      if (!data.success) {
        dispatch(signOutUserFailure(data.message));
        console.error('Sign out failed:', data.message);
        return;
      }
  
      dispatch(signOutUserSuccess(data));
      navigate('/sign-in');
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
      console.error('Sign out error:', err);
    }
  };

   
  useEffect(() => {
    if (file) {
      uploadImageToCloudinary(file);
    }
  }, [file]);


  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`,)
      const data = await res.json();
      if(data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);

    console.log('Response:', data);
   } catch (error) {
      setShowListingsError(true);
      console.error('Error fetching listings:', error.message);
   }
  }
  


  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (data.success === false) {
        console.error('Error deleting listing:', data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error('Error deleting listing:', error.message);
      
    }
  }
  
  return (
    
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          hidden
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />

<div className="relative self-center">
  <div
    onClick={() => fileRef.current.click()}
    className="w-28 h-28 rounded-full border-4 border-blue-500 overflow-hidden shadow-md cursor-pointer hover:opacity-80 transition"
  >
    {formData.avatar ? (
      <img
        src={formData.avatar}
        alt="profile"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl text-gray-600">
        📷
      </div>
    )}
  </div>

  {/* Circular Progress */}
  {uploadProgress > 0 && uploadProgress < 100 && (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-gray-200"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-blue-500"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray={`${uploadProgress}, 100`}
          d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-blue-600">{uploadProgress}%</span>
    </div>
  )}
</div>


        {fileUploadMessage && (
          <p className="text-center text-sm text-slate-600">{fileUploadMessage}</p>
        )}

        <input
          id="username"
          type="text"
          placeholder="username"
          defaultValue={formData.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="email"
          type="email"
          placeholder="email"
          defaultValue={formData.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="password"
          defaultValue={formData.password}

          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
        <Link to="/create-listing" className=" bg-green-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95">Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-4">
        <span onClick={handleDeleteUser} className="text-red-500 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer">Sign out</span>
      </div>

      <p className="text-red-500 mt-3">{error && error}</p>

      {message && (
  <p className={`text-center text-sm mt-4 ${messageType === 'error' ? 'text-red-500' : 'text-green-600'}`}>
    {message}
  </p>
)}
      <button onClick={handleShowListings} className='text-green-700 w-full '>Show Listing</button>
      {showListingsError ? <p className="text-red-500">Error loading listings. Please try again later.</p> : null}
      {userListings.length && userListings.length > 0 && 
        <div className="flex flex-col gap-4 ">
          <h1 className='text-center mt-7  text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
          <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`}>
              {<img className='w-18 h-18 object-contain ' src={listing.imageUrls[0]} alt="listing cover" />}
            </Link>
            <Link to={`/listing/${listing._id}`} className='flex-1'>
              <p className='text-slate-700 font-semibold hover:underline truncate'>{listing.name}</p>
            </Link>

            <div className="flex flex-col items-center">
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
            </div>
          </div>
        ))}
     
        </div> }
       
    </div>
  );
}

export default Profile;
