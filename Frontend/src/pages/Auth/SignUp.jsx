import React from 'react'
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayouts from "../../components/layouts/AuthLayouts";
import Input from '../../components/Inputs/Input';
import { validateEmail, validatePassword, validateName } from "../../utils/helper";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from "../../context/userContext";



const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);


  const { updateUser } = useContext(UserContext);


  const navigate = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateName(fullName)) {
      setError('Please enter Full Name ')
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter valid Email')
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and contain only letters and numbers.");
      return;
    }

    setError('');
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("Something went wrong. Please try again.")
      }
    }






  }



  return (

    <>
      <AuthLayouts>
        <div className="lg:w-[70%] md:h-full flex flex-col justify-center ">
          <h3 className="text-xl font-semibold text-black">Create an Account</h3>
          <p className="text-xs text-slate-700 my-[5px] mb-6">
            Join us today by entering your details below.
          </p>

          <div className="signup-form w-full ">

            <form onSubmit={handleSignUp}>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>

                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  label="Enter Name"
                  placeholder="John Den"
                />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  label="Email Address"
                  placeholder="example@gmail.com"
                />

                <div className='md:col-span-2'>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    label="Password"
                    placeholder="Min 8 Characters"
                  />

                </div>

              </div>





              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}


              <button type="submit" className="btn-primary">
                SIGN UP
              </button>

              <p className="mt-2 text-sm">
                Do you have an account?{" "}
                <Link className="text-sm text-violet-800 underline" to="/login">
                  LogIn
                </Link>
              </p>
            </form>
          </div>
        </div>




      </AuthLayouts>
    </>
  )
}

export default SignUp
