import React from 'react'
import { useState } from 'react';
import {FaRegEye , FaRegEyeSlash} from 'react-icons/fa6'

const Input = ({value , onChange ,type , label , placeholder}) => {
  const [showPassword , setShowPassword] = useState(false);


   const toggleShowPassword = () =>{
    setShowPassword(!showPassword)
  }

  return (
    <>
    <div>
       
       <label className='text-sm text-slate-700'>{label}</label>

       <div className='input-box'>

        <input
         type= {type == 'password' ? showPassword ? 'text' : 'password' : type}
         placeholder = {placeholder}
         className='outline-none'
         value={value}
         onChange={(e) => onChange(e)}              // this catch the brower events and it's a callback function present in parent (as prop drilling from p -> c)
        />

         { type === 'password' && (
             <>
                {showPassword ? (
                  <FaRegEye 
                  size = {22}
                  className='text-primary cursor-pointer'
                  onClick={toggleShowPassword}
                   />
                ) : (
                  <FaRegEyeSlash 
                  size = {22}
                  className='text-primary cursor-pointer'
                  onClick={toggleShowPassword}
                  />
                )
              }
             </>
          )
         }

        
       </div>




    </div>
       
    </>
  )
}

export default Input
