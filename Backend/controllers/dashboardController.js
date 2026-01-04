const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");




// Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        // MongoDB Aggregate ke liye string ID ko ObjectId mein convert karna zaroori hai
        const userObjectId = new Types.ObjectId(String(userId));

        // 1. Fetch Total Income & Expenses using Aggregate
        // Parallel execution (Promise.all) API ko fast banata hai
        const [totalIncomeResult, totalExpenseResult] = await Promise.all([
            Income.aggregate([
                { $match: { userId: userObjectId } }, // Field name must be 'userId'
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Expense.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        // Values nikalna (agar data na ho toh default 0)
        const totalIncome = totalIncomeResult[0]?.total || 0;
        const totalExpense = totalExpenseResult[0]?.total || 0;

        // 2. Income Transactions (Last 60 Days)
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, txn) => sum + txn.amount, 0
        );

        // 3. Expense Transactions (Last 30 Days)
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, txn) => sum + txn.amount, 0
        );

        // 4. Fetch Recent 5 Transactions (Mix of Income & Expense)
        const [recentIncomes, recentExpenses] = await Promise.all([
            Income.find({ userId }).sort({ date: -1 }).limit(5),
            Expense.find({ userId }).sort({ date: -1 }).limit(5)
        ]);

        // Data ko merge karna aur 'type' add karna
        const lastTransactions = [
            ...recentIncomes.map(txn => ({ ...txn.toObject(), type: "income" })),
            ...recentExpenses.map(txn => ({ ...txn.toObject(), type: "expense" }))
        ]
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Latest first
        .slice(0, 5); // Sirf top 5 mix transactions

        // Final Response
        res.status(200).json({
            totalBalance: totalIncome - totalExpense,
            totalIncome,
            totalExpense,
            last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ 
            message: "Server Error", 
            error: err.message 
        });
    }
};








// const Income = require("../models/Income")
// const Expense = require("../models/Expense")
// const {isValidObjectId , Types} = require("mongoose")

// // Dashboard Data
// exports.getDashboardData = async (req , res) =>{
//    try{
//     const userId = req.user.id;
//     const userObjectId = new Types.ObjectId(String(userId));


//     // Fetch total income & expenses
//     const totalIncome = await Income.aggregate([
//         { $match: {userID: userObjectId }},
//         {$group: {_id: null , total:{$sum: "$amount"}}},
//     ]);

//     console.log("totalIncome" , {totalIncome , userId : isValidObjectId(userID)});

//     const totalExpense = await Expense.aggregate([
//         { $match: {userId: userObjectId }},
//         {$group: {_id: null , total: {$sum: "$amount" }}},
//     ]);




//     // get income transactions in the last 60 days 
//     const last60DaysIncomeTransactions = await Income.find({
//         userId,
//         date: { $gte: new Date(Date.now() - 60 * 24 *60 *60 *1000) },
//     }).sort({date: -1 })




//     //Get total income for last 60 days
//     const incomeLast60Days = last60DaysIncomeTransactions.reduce(
//         (sum , transaction) => sum + transaction.amount, 0
//     );




//     // Get expense transaction in the last 30 days
//     const last30DaysExpenseTransactions = await Expense.find({
//         userId,
//         date: {$gte: new Date(Date.now() - 30 *24 * 60 *60 * 1000 ) },
//     }).sort({date: -1});




//     // Get total expenses for last 30 days 
//     const expenseLast30Days = last30DaysExpenseTransactions.reduce(
//         (sum , transaction) => sum + transaction.amount,0
//     );





//       // Fetch last 5 transaction (income + expenses)
//       const lastTransactions = [
//         ...((await Income.find({userId})).toSorted({date: -1}).limit(5)).map(
//             (txn) =>({
//                 ...txn.toObject(),
//                 type: "income",
//             })
//         ),
//         ...((await Expense.find({userId })).toSorted({date: -1}).limit(5)).map((txn) =>({
//             ...txn.toObject(),
//             type: "expense",
//         })),
//       ].sort((a , b) => b.date - a.date);  // sort latest first  






//       // Final Response 
//       res.json({
//         totalBalance: 
//         (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
//         totalIncome: totalIncome[0]?.total || 0,
//         totalExpense: totalExpense[0]?.total || 0,
//         last30DaysExpenses:{
//             total: expenseLast30Days,
//             transaction: last30DaysExpenseTransactions,
//         },
//         last60DaysIncome:{
//             total : incomeLast60Days,
//             transaction: last60DaysIncomeTransactions,
//         },
//         recentTransactions : lastTransactions,
//       });
//    }
//    catch(err){
//     res.status(500).json({message : "Server Error" , err });
//    }
// }