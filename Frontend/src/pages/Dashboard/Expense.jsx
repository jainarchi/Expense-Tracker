import React , {useState , useEffect } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import AddExpenseForm from '../../components/Expense/AddExpenseForm'
import Model from '../../components/layouts/Model'
import ExpenseList from '../../components/Expense/ExpenseList'
import DeleteAlert from '../../components/layouts/DeleteAlert'

const Expense = () => {
  useUserAuth();

  
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    });
    const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false)
    


  const fetchExpenseDetails = async () =>{
    if(loading ) return ;

    setLoading(true);
    try{
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);

      if(response.data){
        setExpenseData(response.data);
      }
    }catch(error){
      console.log("Something went wrong. Please try again." , error)
    }finally{
      setLoading(false);
    }

  }
  


  const handleAddExpense = async (expense) =>{
    const {category , amount , date , icon} = expense;

    //Validate Checks
    if(!category.trim()){
      toast.error("category is required.");
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
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE , {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModel(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    }catch(err){
      console.error("Error adding expense: " , 
        err.response?.data?.message || err.message
      );
    }

  }

  const deleteExpense = async (id) =>{
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))

      setOpenDeleteAlert({show: false , data:null});
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();

    }catch(error){
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }

  }

  const handleDownloadExpenseDetails = async () =>{
      // const url = window.URL.createObjectURL(new Blob([response.data]))
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download" , "expense_details.xlsx");
      // document.body.appendChild(link);
      // link.click();
      // link.parentNode.removeChild(link);
      // window.URL.revokeObjectURL(url);

  }
  




  useEffect(() => {
     fetchExpenseDetails();  
    return () => {}
  }, [])
  


  return (
    <>
      <DashboardLayout activeMenu="Expense">
        <div className='my-5 mx-auto'>
          <div className='grid grid-cols-1 gap-6'>
            <div className=''>
              <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModel(true)}
              />
            </div>

            <ExpenseList 
            transactions={expenseData}
            onDelete={(id) =>{
              setOpenDeleteAlert({shhow: true , data: id})
            }}
            onDownload={handleDownloadExpenseDetails}
            />




          </div>

          <Model 
           isOpen={openAddExpenseModel}
           onClose={() => setOpenAddExpenseModel(false)}
           title="Add Expense"
          >
             <AddExpenseForm onAddExpense={handleAddExpense} />
          </Model>

          


            <Model
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenAddExpenseModel({show: false , data: null})}
            title="Delete Expense"
            >
              <DeleteAlert 
                content="Are your sure you want to delete this expense details ?"  
                onDelete={() => deleteExpense(openDeleteAlert.data)}
                />
            </Model>



        </div>
      </DashboardLayout>
    </>
  )
}

export default Expense
