import React, { useState } from 'react'

function CreateListing() {

    const [files, setFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    
    console.log(files);
    
    const handleImageSubmit = async () => {
        if (files.length < 1 || files.length > 6) {
            setErrorMsg('You must upload between 1 and 6 images.');
            return;
          }
          setErrorMsg(''); // Clear error before uploading
          
      
        setUploading(true);
        try {
          const urls = await Promise.all(files.map(file => storeImg(file)));
          setUploadedUrls(urls);
        } catch (err) {
          console.error('❌ Error uploading images:', err);
        } finally {
          setUploading(false);
        }
      };

    
      const handleRemoveImage = (index) => {
        const updatedUrls = [...uploadedUrls];
        updatedUrls.splice(index, 1);
        setUploadedUrls(updatedUrls);
      };
      
    
    const storeImg = async (file) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'e5v6bwbz');
      
          fetch('https://api.cloudinary.com/v1_1/drkevbsa1/image/upload', {
            method: 'POST',
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.secure_url) {
                resolve(data.secure_url);
              } else {
                reject(new Error('Failed to upload image'));
              }
            })
            .catch((err) => reject(err));
        });
      };

      const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
      
        // Générer les URLs locales pour affichage
        const preview = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(preview);
      };
      
    
  return (
      <main className='p-2 max-w-5xl mx-auto'>
          <h1 className='text-3xl font-semibold text-center my-7'>Create a New Listing</h1>
          <form className='flex flex-col sm:flex-row gap-4'>
              <div className='flex flex-col gap-4 flex-1'>
                  <input type='text' id='name' placeholder='Name' className='border p-3 bg-white rounded-lg ' maxLength={62} minLength={10} required />
                  <textarea type='text' id='description' placeholder='Description' className='border p-3 bg-white rounded-lg ' required />
                  <input type='text' id='adresse' placeholder='Adresse' className='border p-3 bg-white rounded-lg ' required />

                  <div className="flex gap-6 flex-wrap ">
                      <div className='flex gap-2'>
                          <input type='checkbox' name="" id="sale" className='w-5 accent-blue-500'  />
                          <span>Sell</span> 
                      </div> 
 
                      <div className='flex gap-2'> 
                          <input type='checkbox' name="" id="rent" className='w-5 accent-blue-500'  />
                          <span>Rent</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type='checkbox' name="" id="parking" className='w-5 accent-blue-500'  />
                          <span>Parking </span>
                      </div>

                      <div className='flex gap-2'>
                          <input type='checkbox' name="" id="furnished" className='w-5 accent-blue-500'  />
                          <span>Furnished</span>
                      </div>

                      <div className='flex gap-2'>
                          <input type='checkbox' name="" id="offer" className='w-5 bg-amber-200 accent-blue-500'  />
                          <span>Offer</span>
                      </div>
                  </div>
                  {/* //kkkk */}
                  <div className="flex flex-wrap gap-6">
                      <div className='flex gap-2 items-center'>
                          <input type="number" name="" id="bedrooms" min='1' max='10' className='border border-gray-300 p-3 bg-white rounded-lg ' required />
                          <p>Beds</p>
                      </div>
                       
                      <div className='flex gap-2 items-center'>
                          <input type="number" name="" id="bathrooms" min='1' max='10' className='border border-gray-300 p-3 bg-white rounded-lg ' required />
                          <p>Baths</p>
                      </div>

                      <div className='flex gap-2 items-center'>
                          <input type="number" name="" id="regularPrice" min='1' max='10' className='border border-gray-300 p-3 bg-white rounded-lg ' required />
                          <div className="flex flex-col items-center">
                              <p>Regular price</p>
                              <span className='text-xs'>($ / month)</span>
                          </div>
                      </div>

                      <div className='flex gap-2 items-center'>
                          <input type="number" name="" id="DiscountPrice" min='1' max='10' className='border border-gray-300 p-3 bg-white rounded-lg ' required />
                           <div className="flex flex-col items-center">
                          <p>Discounted price</p>
                          <span className='text-xs'>($ / month)</span>
                          </div>
                      </div>

                  </div>
              </div>
              {/* //kkkk */}
              <div className="flex flex-1 flex-col gap-4">
                  <p className="font-semibold">Images:
                  <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                  </p>
                  <div className="flex gap-4">
                  <input
  onChange={handleFileChange}
  className='p-3 border border-gray-300 rounded w-full'
  type="file"
  id='images'
  accept='image/*'
  multiple
                      />
<button
  type="button"
  onClick={handleImageSubmit}
  disabled={uploading}
  className={`p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80${
    uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700'
  }`}
>
  {uploading ? 'Uploading...' : uploadedUrls.length > 0 ? 'Uploaded' : 'Upload'}
                      </button>
                  
                  </div>
                  {errorMsg && (
                      <p className="text-red-600  text-sm">
    {errorMsg}
  </p>
)}


                  {uploadedUrls.length > 0 && (
  <div className='flex flex-wrap gap-4 mt-4'>
    {uploadedUrls.map((url, index) => (
      <div key={index} className='relative w-24 h-24 rounded overflow-hidden border'>
        <img src={url} alt={`uploaded ${index}`} className='w-full h-full object-cover' />
        <button
  onClick={() => handleRemoveImage(index)}
  className="absolute pb-1 top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-90 transition"
>
  &times;
</button>

      </div>
    ))}
  </div>
                  )}
                  

              <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">create listing</button>
              </div>

          </form>
    </main> 
  )
}

export default CreateListing