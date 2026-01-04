const jwt = require("jsonwebtoken")
const User = require("../models/UserModel")

exports.protect = async (req , res , next) =>{
    let token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message: "Not authorized, no token"});
    

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);  
       
        req.user = await User.findById(decoded.id).select('-password');
        next();
        
    }catch(err){
        res.status(500)
        .json({message: "Not authorized, token failed"})
    }



}

  // it check token is made only using our JWT_secret  
  // 2- it extract data from token then asign decoded var