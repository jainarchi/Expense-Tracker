const User = require("../models/UserModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");




const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
};





exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are requied" })
    }

    try {
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ message: "Email already in use" })
        }
    
        const hashPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            fullName,
            email,
            password : hashPassword,
            profileImageUrl,
        });
        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message })
    }

};


exports.loginUser = async (req, res) => { 
    const {email , password} = req.body;
    

    if(!email || !password){
        return res.status(400).json({message: "All fields are required"})
    }

    try{
        const user = await User.findOne({email});

         if(! user || ! (await bcrypt.compare(password , user.password))){
            return res.status(400).json({message: "invalid credentials"})
         }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    }catch (err) {
      res
        .status(500)
        .json({message: "Error registering user" , error: err.message})
    }


};


exports.getUserInfo = async (req, res) => { 
   
    try{
        const user = await User.findById(req.user.id).select("-password");

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);
    }
    catch(err){
        res
        .status(500)
        .json({message: "Error registering user" , error: err.message });
    }


};
