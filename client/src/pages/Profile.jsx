import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    if (file) {
      uploadImageToCloudinary(file);
    }
  }, [file]);

  const uploadImageToCloudinary = async (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'e5v6bwbz'); // ton preset Cloudinary

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/drkevbsa1/image/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
        setFileUploadMessage('✅ Image uploaded successfully');
      } else {
        setFileUploadMessage('❌ Failed to upload image');
      }
    } catch (err) {
      console.error('Cloudinary Error:', err);
      setFileUploadMessage('❌ Error uploading image');
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

    dispatch(updateUserStart());

    try {
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
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
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/sign-in');
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

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

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar}
          alt="profile"
          className="rounded-full w-24 h-24 object-cover self-center cursor-pointer mt-2"
        />

        {fileUploadMessage && (
          <p className="text-center text-sm text-slate-600">{fileUploadMessage}</p>
        )}

        <input
          id="username"
          type="text"
          placeholder="username"
          value={formData.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="email"
          type="email"
          placeholder="email"
          value={formData.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          value={formData.password}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>

      <div className="flex justify-between mt-4">
        <span onClick={handleDeleteUser} className="text-red-500 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer">Sign out</span>
      </div>

      <p className="text-red-500 mt-3">{error && error}</p>
    </div>
  );
}

export default Profile;
