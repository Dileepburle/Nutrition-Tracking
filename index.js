const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
//models
const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");
const trackingModel = require("./models/trackingModel");

const verifyToken = require("./verifyToken");
//database connection

mongoose.connect("mongodb://127.0.0.1:27017/NutrifyApp")
.then(()=>{
    console.log("Database is connected")
})
.catch((err)=>{
    console.log(err)
})




app.use(cors());
app.use(express.json())


//endpoint for registration

app.post('/register', (req,res)=>{

    let user = req.body;


     bcrypt.genSalt(10,(err,salt)=>{
            if(!err){
                bcrypt.hash(user.password,salt,async(err,hpass)=>{
                    if(!err){
                        user.password = hpass;
                         try {
                            let doc = await userModel.create(user)
                            res.status(201).send({message:"user registered successfully"})
                        } catch (err) {
                            console.log(err)
                            res.status(500).send({message:"something went wrong"})
                        }
                    }
                })
            }
        })
   
   
})


//endpoint for login

app.post("/login",async (req,res)=>{
    let userCred = req.body;
    try {
       const user = await userModel.findOne({email:userCred.email})
       if(user!==null){
          bcrypt.compare(userCred.password,user.password,(err,success)=>{
            if(success==true){
                jwt.sign({email:userCred.email},"NutrifyApp",(err,token)=>{
                    if(!err){
                        res.send({message:"login successful",name:user.name,token:token,userId:user._id})
                    }
                    else{
                        res.send({message:"invalid token"})
                    }
                })
            }
            else{
                res.status(403).send({message:"wrong password"})
            }
          })
       }
       else{
        res.status(404).send({message:"user not found"})
       }
    } catch (err) {
       res.status(500).send({message:"something went wrong"})
    }
})

//endpoint to see all foods

app.get("/foods",verifyToken,async(req,res)=>{

    try {
        let foods = await foodModel.find();
        res.send(foods)
    } catch (error) {

        console.log(err)
        res.send({message:"no foods found"})
    }
   
})

//endpoint to search food by name
app.get("/foods/:name",verifyToken,async(req,res)=>{

    try {
        let foods =  await foodModel.find({name:{$regex:req.params.name,$options:'i'}});
        if(foods.length>=0){
            res.send(foods)
        }
        else{
            res.status(404).send({message:"Food item is not found"})
        }
        
    } catch (error) {
        res.status(500).send({message:"some problem in getting the food"})
    }
  
})

//endpoint to track the food item
app.post("/track",verifyToken,async(req,res)=>{
    let trackData = req.body;
    try {
        let data = await trackingModel.create(trackData);
        res.status(201).send({message:"tracked food added"}) 
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"some problem in putting the food"});
    }
})


//endpoint to track thhe food eaten by the user/person

app.get("/track/:userid/:date",verifyToken,async(req,res)=>{
    let userid = req.params.userid;
    let date = new Date(req.params.date);
    let strDate = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();

    try {
       let foods = await trackingModel.find({userId: userid,eatenDate:strDate}).populate('userId').populate('foodId') 
       res.send(foods)
    } catch (error) {
        console.log(error)
        res.send({message:"some problem in getting the food"})
    }
})

app.listen(8000,()=>{
    console.log("server is up and running")
})