require('dotenv').config();
const express = require('express')
const path = require('path')
const cors = require("cors");
const app = express()
const PORT = process.env.PORT || 5000;

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const incomeRoutes = require('./routes/incomeRoutes')



app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);


app.use(express.json());

connectDB();

app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/income" , incomeRoutes)



// server upload folder
app.use("./uploads" , express.static(path.join(__dirname , "uploads")));




app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
