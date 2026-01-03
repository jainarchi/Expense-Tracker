import React from 'react'
import Card2 from '../../assets/Card2.png'
import {LuTrendingUpDown} from 'react-icons/lu'

const AuthLayouts = ({children}) => {


  return (
    <>

    <div className='flex '>

    <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>
        {children}
    </div>

    <div className='hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-no-repeat bg-center overflow-hidden p-8 relative'>
       
        <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5' />
        <div className='w-48 h-48 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-1.5' />
        <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -bottom-7 -left-5' />


        <div className='grid grid-cols-1 z-20'>
            <StatsInfoCard
                icon={<LuTrendingUpDown/>}
                label= 'Track Your Income & Expenses'
                value='430,000'
                color='bg-primary'
            />
        </div>



        <img src={Card2}
         className='w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400 rounded-xl'
         alt="card2" 
         />


     </div>
    </div>

      
    </>
  )
}

export default AuthLayouts;









const StatsInfoCard =({icon , label , value , color}) =>{
      return <div className='w-[80%] bg-white z-20 flex gap-3 p-2.5 rounded-xl shadow-lg shadow-purple-500 '>


         <div className={`w-12 h-12  flex items-center justify-center text-[26px] text-white rounded-full ${color} `}>

             {icon}
         </div>

         <div>
            <h6 className='text-sm text-slate-600 '>{label}</h6>
            <span className='text-black text-lg'>${value}</span>
         </div>

         
      </div>
}
