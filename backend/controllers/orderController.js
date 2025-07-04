import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'
import razorpay from 'razorpay'

// Global Variables
const currency ='AED'
const deliveyCharge=10

//Gateway Initialize
const stripe= new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
})

//Placing order using COD Method
const placeOrder=async(req,res)=>{
    try {
        const {userId,items,address,amount}=req.body

        const orderData={
            userId,
            items,
            address,
            amount,
            paymentMethod:'COD',
            payment:false,
            date:Date.now()
        }
        const newOrder= new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed Successfully"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//Placing order using Stripe Method
const placeOrderStripe=async(req,res)=>{
    try {
        const {userId,items,address,amount}=req.body
        const {origin}=req.headers;
        
        const orderData={
            userId,
            items,
            address,
            amount,
            paymentMethod:'Stripe',
            payment:false,
            date:Date.now()
        }

        const newOrder= new orderModel(orderData)
        await newOrder.save()

        const line_items=items.map((item)=>(
            {
                price_data:{
                    currency:currency,
                    product_data:{
                        name:item.name
                    },
                    unit_amount:item.price*100
                },
                quantity:item.quantity
            }
        ))
        line_items.push({
            price_data:{
                    currency:currency,
                    product_data:{
                        name:'Delivery Charges'
                    },
                    unit_amount:deliveyCharge * 100
                },
                quantity:1

        })

        const session= await stripe.checkout.sessions.create({
            success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode:'payment',
        })
        res.json({success:true, session_url:session.url})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
    
}

// Verify Stripe

const verifyStrip=async(req,res)=>{
    const {userId,orderId,success}=req.body
    try {
        if(success==='true'){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message}) 
    }

}

//Placing order using Razorpay Method
const placeOrderRazorpay=async(req,res)=>{
    try {
        const {userId,items,amount,address}=req.body

        const orderData={
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment:false,
            date:Date.now()
        }
        const newOrder=new orderModel(orderData)
        await newOrder.save()

        const options={
            amount: amount*100,
            currency:currency.toLocaleUpperCase(),
            receipt: newOrder._id.toString()
        }
        await razorpayInstance.orders.create(options,(error,order)=>{
           if (error){
            console.log(error)
            return res.json({success:false,message: error})
            }
            res.json({success:true,order})
        })
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message}) 
        
    }
    
}
//Verify Razorpay

const verifyRazorpay=async(req,res)=>{
    try{
        const {userId, razorpay_order_id}=req.body

        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status==='paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment:true})
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true,message:"Payment Successful"})
        }else{
            res.json({success:false,Message:"Payment Failed"})
        }
        
    }catch(error){

        console.log(error);
        res.json({success:false,message:error.message}) 

    }

}

// All the Orders Data for Admin Panel
const allOrders = async(req,res)=>{
    try {
        const orders=await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})      
    }
}

// User Orders Data for Frontend
const userOrders = async(req,res)=>{
    try {
        const {userId}=req.body
        const orders=await orderModel.find({userId})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})    
    }
}

//Updata Orders Status from Admin Panel
const updateStatus = async(req,res)=>{
    try {
        const {orderId,status}=req.body

        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true,message:'Status Updated'})
    } catch (error) {

        console.log(error);
        res.json({success:false,message:error.message})
        
    }

    
}

export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus, verifyStrip, verifyRazorpay}