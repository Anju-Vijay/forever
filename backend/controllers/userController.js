import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';


//Create a token
const createToken =(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET)
    
}

//Route for user login
const loginUser= async(req,res)=>{

}

//Route for user registration
const registerUser=async(req,res)=>{
    
   try {
    const {name,email,password}=req.body;

    // Check if the user already exists
   const userExists= await userModel.findOne({email})

   if(userExists){
      return res.json({success:false, message: 'User already exists'})

   }
   // Validating email format and strong password
   if(!validator.isEmail(email)){
       return res.json({success:false, message: 'Please enter a valid email'})

   }
   if (password.length < 8){
       return res.json({success:false, message:'Please enter a strong password'})

   }
   // Hash the password
   
   const salt=await bcrypt.genSalt(10)
   const hashedpassword= await bcrypt.hash(password,salt)

     // Create a new user
   const newUser=new userModel({
       name,
       email,
       password: hashedpassword,
   })

   // Save the user to the database
   const user= await newUser.save()
   const token = createToken(user._id)
   res.json({success:true, token});

   } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
   }
}       

//Route for admin login

const adminLogin=async(req,res)=>{

}

export {loginUser,registerUser,adminLogin}