import { useState } from 'react'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
function CreateListing() {

  const navigate = useNavigate(); // ✅ à ajouter

  const {currentUser} = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [error, setError] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
        address: '',
        type: 'rent', // ou 'sale'
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        imageUrls: [], // URL des images uploadées
  });

  // console.log('Current preview images:', previewImages);
    // useEffect(() => {
    //     console.log('formData mis à jour:', formData.imageUrls);
    //   }, [formData]);
      



   
    
    const handleImageSubmit = async () => {
      if (files.length < 1 || files.length > 6) {
        setError(prev => [...prev, "You must upload between 1 and 6 images"]);

            return;
          }
          setError([]); // Clear error before uploading
          
      
        setUploading(true);
        try {
          const urls = await Promise.all(files.map(file => storeImg(file)));
            setUploadedUrls(urls);
            setFormData((prev) => ({
                ...prev,
                imageUrls: urls,
              }));
              
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
  

  const handleChange = (e) => {
    if (e.target.id === 'sell' || e.target.id === 'rent') {
      setFormData((prev) => ({
        ...prev,
        type: e.target.id,
      }));
    }
      
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: e.target.checked,
      }));
    }
      
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    }

  }
      
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    setError([]); // Met tout en haut de handleSubmit
    const errors = [];

    if (formData.imageUrls.length < 1) {
      errors.push("You must upload at least one image.");
    }
  
    if (formData.discountPrice >= formData.regularPrice) {
      errors.push("Discounted price must be less than regular price.");
    }
  
    // ❗ Si erreurs → les afficher et bloquer la suite
    if (errors.length > 0) {
      setError(errors);
      return;
    }
        console.log('Listing submitted:', formData);
        try {
          
          if (formData.imageUrls.length < 1) return setError(prev => [...prev, "You must upload at least one image."]);
          if (formData.discountPrice >= formData.regularPrice) return setError(prev => [...prev, "Discounted price must be less than regular price."]);
          setLoading(true);
          setError([]);
          const res = await fetch('/api/listing/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              userRef: currentUser._id
            }
            ),
          });

        

          const data = await res.json();
          setLoading(false);
          if (data.success === false) {
            setError(prev => [...prev, data.message || 'Failed to create listing']);
            return;
          }
          console.log('Listing created successfully:', data);
          navigate(`/listing/${data._id}`);
        } catch (error) {
          console.error('Error submitting listing:', error);
          setError(prev => [...prev, 'Failed to submit listing. Please try again.']);
        }
        // Tu peux ensuite envoyer formData à ton backend ici avec fetch ou axios
      };
      
  return (
      <main className='p-2 max-w-5xl mx-auto'>
          <h1 className='text-3xl font-semibold text-center my-7'>Create a New Listing</h1>
          <form   onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
              <div className='flex flex-col gap-4 flex-1'>
                  <input onChange={handleChange}   value={formData.name} type='text' id='name' placeholder='Name' className='border p-3 bg-white rounded-lg ' maxLength={62} minLength={3} required />
                  <textarea onChange={handleChange} value={formData.description} type='text' id='description' placeholder='Description' className='border p-3 bg-white rounded-lg ' required />                  <input onChange={handleChange} value={formData.address} type='text' id='address' placeholder='address' className='border p-3 bg-white rounded-lg ' required />

                  <div className="flex gap-6 flex-wrap ">
                      <div className='flex gap-2'>
                          <input  onChange={handleChange} checked={formData.type === 'sell'} type='checkbox' name="" id="sell" className='w-5 accent-blue-500'  />
                          <span>Sell</span> 
                      </div> 
 
                      <div className='flex gap-2'> 
                          <input onChange={handleChange} checked={formData.type === 'rent'} type='checkbox' name="" id="rent" className='w-5 accent-blue-500'  />
                          <span>Rent</span>
                      </div>
                      <div className='flex gap-2'>
                          <input onChange={handleChange} checked={formData.parking} type='checkbox' name="" id="parking" className='w-5 accent-blue-500'  />
                          <span>Parking </span>
                      </div>

                      <div className='flex gap-2'>
                          <input onChange={handleChange} checked={formData.furnished} type='checkbox' name="" id="furnished" className='w-5 accent-blue-500'  />
                          <span>Furnished</span>
                      </div>

                      <div className='flex gap-2'>
                          <input onChange={handleChange} checked={formData.offer} type='checkbox' name="" id="offer" className='w-5 bg-amber-200 accent-blue-500'  />
                          <span>Offer</span>
                      </div>
                  </div>
                  {/* //kkkk */}
                  <div className="flex flex-wrap gap-6">
                      <div className='flex gap-2 items-center'>
                          <input onChange={handleChange} value={formData.bedrooms} type="number" name="" id="bedrooms" min='1' max='10' className='border border-gray-300 p-3 bg-white rounded-lg ' required />
                          <p>Beds</p>
                      </div>
                       
                      <div className='flex gap-2 items-center'>
                          <input onChange={handleChange} value={formData.bathrooms} type="number" name="" id="bathrooms" min='1' max='10' className='border border-gray-300 p-3 bg-white rounded-lg ' required />
                          <p>Baths</p>
                      </div>

                      <div className='flex gap-2 items-center'>
                          <input onChange={handleChange} value={formData.regularPrice} type="number" name="" id="regularPrice" min='50' max='10000' className='border border-gray-300 p-3 bg-white rounded-lg ' required />
                            <div className="flex flex-col items-center">
                              <p>Regular price</p>
                              <span className='text-xs'>($ / month)</span>
                          </div>
                      </div>

            {formData.offer && (
                <div className='flex gap-2 items-center'>
                <input onChange={handleChange} value={formData.discountPrice} type="number" name="" id="discountPrice" min='0' max='10000' className='border border-gray-300 p-3 bg-white rounded-lg ' required />
                 <div className="flex flex-col items-center">
                <p>Discounted price</p>
                      <span className='text-xs'>($ / month)</span>
                </div>
            </div>
            )}
                    

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
                  {/* {error && (
                      <p className="text-red-600  text-sm">
    {error}
  </p>
)} */}


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
                  

          <button disabled={uploading || loading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Creating...' : 'Create Listing'}</button>
          {error.length > 0 &&
  error.map((err, index) => (
    <p key={index} className="text-red-700 text-sm">{err}</p>
))}

              </div>
 
          </form>
    </main> 
  )
}

export default CreateListing