import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import AuthLayouts from '../../components/layouts/AuthLayouts'
import Input from '../../components/Inputs/Input'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  let handleLogin = (e) => {
    e.preventDefault();
  }


  return (
    <AuthLayouts>
      <div className='lg:w-[70%] md:h-full flex flex-col justify-center '>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 my-[5px] mb-6'>Please enter your details to log in</p>

        <div className='login-form w-full '>
         <form onSubmit={handleLogin} >
          <Input
             value = {email}
             onChange = {(target) => setEmail(target.value)}
             type= 'text'
             label= 'Email Address'
             placeholder = 'example@gmail.com'

          />
          <Input 
            value={password}
            onChange={(target) => setPassword(target.value)}
            type= 'password'
            label = 'Password'
            placeholder= 'Min 8 Characters'          
          
          />
          {error && <p className='text-red-500 text-xs pb-2.5' >{error}</p>}

          <button type='submit' className='btn-primary'>
            LOGIN
          </button>

          <p className='mt-2'>
            Don't have an account?{" "}
            <Link className='text-md text-violet-800 underline' 
            to='/signup'>
                SignUp
            </Link>
          </p>


         </form>
        </div>



      </div>
    </AuthLayouts>
  )
}

export default Login
