import mongoose from 'mongoose'

const connectDB=async()=>{
    try {
    mongoose.connection.on('connected', ()=>{
        console.log("DB connected")
    })
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to e-commerce database successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
export default connectDB;