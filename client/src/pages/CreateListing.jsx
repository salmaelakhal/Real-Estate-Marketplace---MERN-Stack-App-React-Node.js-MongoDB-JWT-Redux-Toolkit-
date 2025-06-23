import React from 'react'

function CreateListing() {
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
                          <span>Parking <i class="fa fa-spotify" aria-hidden="true"></i></span>
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
                      <input className='p-3 border borer-gray-300 rounded w-full ' type="file" id='images' accept='image/*' multiple />
                      <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
                  </div>
              <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">create listing</button>
              </div>

          </form>
    </main> 
  )
}

export default CreateListing