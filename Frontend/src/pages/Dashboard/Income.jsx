import React , {useState , useEffect} from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Model from '../../components/layouts/Model'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import { toast } from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList'
import DeleteAlert from '../../components/layouts/DeleteAlert'
import {useUserAuth} from '../../hooks/useUserAuth'



const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModel, setOpenAddIncomeModel] = useState(true)
  

  // get all Income details
  const fetchIncomeDetails = async () =>{
    if(loading ) return ;

    setLoading(true);
    try{
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`);

      if(response.data){
        setIncomeData(response.data);
      }
    }catch(error){
      console.log("Something went wrong. Please try again." , error)
    }finally{
      setLoading(false);
    }

  }
  
  const handleAddIncome = async (income) =>{
    const {source , amount , date , icon} = income;

    //Validate Checks
    if(!source.trim()){
      toast.error("Source is required.");
      return;
    }

    if(! amount || isNaN(amount) || Number(amount) <= 0 ){
      toast.error("Amount should be a valid number greater than 0.")
      return;
    }

    if(! date){
      toast.error("Date is required.");
      return;
    }

    try{
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME , {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModel(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    }catch(err){
      console.error("Error adding income: " , 
        err.response?.data?.message || err.message
      );
    }

  }

  const deleteIncome = async (id) =>{
    try{
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))

      setOpenDeleteAlert({show: false , data:null});
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();

    }catch(error){
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message
      );
    }

  }

  const handleDownloadIncomeDetails = async () =>{

  }
  

  useEffect(() => {
    fetchIncomeDetails();
  
    return () => {}
  }, [])
  


  return (
    <div>
      <DashboardLayout activeMenu="Income">
        <div className='my-5 mx-auto'>
          <div className='grid grid-cols-1 gap-6'>
            <div className=''>

              <IncomeOverview 
               transactions={incomeData}
               onAddIncome={() => setOpenAddIncomeModel(true)}
              />

            </div>

              <IncomeList 
              transactions={incomeData}
              onDelete={(id) => {
                setOpenDeleteAlert({show: true , data: id});
              }}
              onDownload={handleDownloadIncomeDetails}             
              />

          </div> 


          <Model 
            isOpen={openAddIncomeModel}
            onClose={() => setOpenAddIncomeModel(false)}
            title="Add Income"
            >
              <AddIncomeForm onAddIncome={handleAddIncome} />
           </Model>
            
            <Model
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenAddIncomeModel({show: false , data: null})}
            title="Delete Income"
            >
              <DeleteAlert 
                content="Are your sure you want to delete this income details ?"  
                onDelete={() => deleteIncome(openDeleteAlert.data)}
                />
            </Model>





        </div>

       
      </DashboardLayout>

       </div>
    
  )
}

export default Income
