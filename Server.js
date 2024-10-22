const express = require('express')

const mongoose = require('mongoose')

const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());

//database connetion

const Mongo_Url = 'mongodb://localhost:27017/CRM';

mongoose.connect(Mongo_Url)
.then(()=>{console.log("connect success")})
.catch((err)=>{console.log("Connection failed",err)})

//create a module for signup

const signupSchema =new mongoose.Schema({
    username:{
        type:String,
        reuired:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    passward:{
        type:String,
        required:true
    }
});

const Signup = mongoose.model("Signup",signupSchema);

app.post("/api/signups",async (req,res)=>{
    try {
        const {username,email,passward} = req.body;

        if(!username || !email || !passward){
           return res.status(400).json({message:"All field required"});
        }
        //create a new user instance
        const newUser = new Signup(
            {
                username,
                email,
                passward
            }
        );

        await newUser.save()
        res.status(201).json({message:"user created successfully",Signup:newUser})

    } catch (error) {
        console.log("Error by user",error);
        res.status(500).json({message:"Error creating user"})
    }
})  


//Login Api
app.post ('/api/login',async(req,res)=>{
  try{
    const {email,passward} = req.body;
    if(!email || !passward){return res.status(400).json({message:"email and pasward"})}
 

  //find a signups email
  const exitinguser=await Signup.findOne({email});
  if(!exitinguser){
    return res.status(400).json({message:'Invalid email'})

  }
  if(exitinguser.passward!=passward){
    return res.status(400).json({message:'Invalid passward'})
    
}
   res.status(200).json({message:"Login Succesfull",user:exitinguser});

  }
  catch(error){
    console.error("Error during Login",error);
    res.status(500).json({message:"Error during Login"});

  }
})

const Port = 3006;
app.listen(Port,()=>{
    console.log(`Server is running at port ${Port}`)
})