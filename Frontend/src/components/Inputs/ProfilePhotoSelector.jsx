import React , {useRef , useState} from 'react';
import {LuUser , LuUpload , LuTrash} from 'react-icons/lu' ;



const ProfilePhotoSelector = ({image , setImage}) => {

  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);


  
  const handleImageChange = (e) =>{
     const file = e.target.files[0];

     if(file){
     setImage(file);
     setPreviewUrl( URL.createObjectURL(file))
     }
  }

  const handleRemoveImage = () =>{
     setImage(null);
     setPreviewUrl(null);
     if (inputRef.current) {
        inputRef.current.value = ""; 
     }
  }
   

  const onChooseFile = () =>{
    inputRef.current.click();     // trigger the hidden inp 
  }



  return (
    <>
    <div className='flex justify-center mb-6'>

        <input 
        type="file" 
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
        />


        { !image ? (

            <div className='w-20 h-20 bg-violet-200 rounded-full flex justify-center items-center relative '>
                <LuUser className='text-2xl' /> 

                <button
                 type='button' 
                 className='bg-violet-100 rounded-full p-1 absolute right-0.5 bottom-0.5'
                 onClick={onChooseFile}
                >
                    <LuUpload />
                </button>
            </div>

        ) :
         (
            <div className='relative'>

               <img 
                src={previewUrl}
                alt='profile photo'
                className= 'h-20 w-20 rounded-full object-cover'
                />

                <button 
                 type='button'
                 className='bg-red-300 rounded-full p-1 absolute right-0.5 bottom-0.5'
                 onClick={handleRemoveImage}
                >
                    <LuTrash />
                </button>
            </div>
        )
    
       }



    </div>


      
    </>
  )
}

export default ProfilePhotoSelector
