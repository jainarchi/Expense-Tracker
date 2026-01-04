const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImageUrl: { type: String, default: null },
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model("User" , UserSchema)






// UserSchema.pre("save" , async function(){
//     if(!this.isModified("password")) return;
//     this.password = await bcrypt.hash(this.password , 10);
// })


// UserSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword , this.password);
// }



// Jab aap function ke aage async likhte hain, automatically ek Promise return karta hai.

// Mongoose ko pata hai ki agar function async hai, toh jaise hi Promise resolve hogi (yani function khatam hoga), use agle step par khud hi chale jaana hai.

// Is case mein next() ki zaroorat khatam ho jati hai.