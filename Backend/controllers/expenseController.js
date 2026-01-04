const Expense = require("../models/Expense")
const xlsx = require('xlsx')




exports.addExpense = async (req , res) =>{
   const userId =req.user.id;

   try{
    const {icon , category , amount , date } = req.body;

    if(! category || ! amount || ! date){
        return res.status(400).json({message: "All fields are required"})
    }

    const newExpense = new Expense({
        userId ,
        icon,
        category,
        amount,
        date : new Date(date)
    });

    await newExpense.save();


    res.status(200).json({newExpense});
   }
   catch(err){
    res.status(500).json({message: "Server Error"});
   }
}




exports.getAllExpense = async (req , res) =>{
    const userId = req.user.id

   try{
      const expense = await Expense.find({userId}).sort({ date: -1});
      res.json(expense);

   }catch(err){
    res.status(500).json({message: "Server Error"});
   }
}


exports.deleteExpense = async (req , res) =>{

   try{
    await Expense.findByIdAndDelete(req.params.id);
    res.json({message: "Expense deleted successfully"});
   }
   catch(error){
    res.status(500).json({message: "Server Error"});
   }

}

// exports.downloadIncomeExcel = async (req , res) =>{
//     const userId = req.user.id;

//     try{
//         const income = (await Income.find({userId})).sort({date : -1})

//         // Prepare data for Excel
//         const data = income.map((item) => ({
//             Source: item.source,
//             Amount: item.amount,
//             Date: item.date,
//         }));


//         const wb = xlsx.utils.book_new();
//         const ws = xlsx.utils.json_to_sheet(data);
//         xlsx.utils.book_append_sheet(wb, ws , "Income");
//         xlsx.writeFile(wb , 'income_details.xlsx');
//         res.download('income_details.xlsx')

//     }
//     catch(err){
//         res.status(500).json({message: "Server Error"})
//     }

// }

exports.downloadExpenseExcel = async (req, res) => { 
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        if (expenses.length === 0) {
            return res.status(404).json({ message: "No data found to export" });
        }

        const data = expenses.map((item) => ({     
            Category: item.category, 
            Amount: item.amount,
            Date: item.date ? item.date.toISOString().split('T')[0] : 'N/A',
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        
       
        xlsx.utils.book_append_sheet(wb, ws, "Expenses"); 

        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

     
        res.setHeader("Content-Disposition", "attachment; filename=expense_details.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          
        res.status(200).send(buffer);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};