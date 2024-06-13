const express=require("express")
const app=express()
const path=require("path")
const mongoose=require("./mongo-files/user")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');



app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(bodyParser.json());

app.get("/" ,function(req,res){
    res.send("home")
})

app.get("/profile",isLoggedIn,function(req,res){
    res.send(req.cookies.user)
})

app.get("/creation-user",function(req,res){
    res.render("index")
   
})

app.post("/creation-user", async function(req,res){
const {user,email,password}=req.body

const username= await mongoose.findOne({user:user})

if(username){
    res.send("invalid user")
}
else{
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt,async function(err, hash) {
       const create= await mongoose.create({user:user,password:hash,email:email})
       res.redirect("/login")
    });
});
}
  
})

app.get("/login",  function(req,res){

    res.render("login") 
      
    })

    app.get("/logout",  function(req,res){

    res.clearCookie("token");     
    res.send(req.cookies.token)
          
        })

app.post("/login",async function(req,res){

const {user,email,password}=req.body
 
const userlogin=await mongoose.findOne({user:user,email:email})



if(userlogin){
    bcrypt.compare(password, userlogin.password, function(err, result) {
        if(result){
            var token = jwt.sign({email:email,user:user}, 'shhhhh');
            res.cookie("token",token)
            res.send("successfull login")
        }
        else{
            res.send("invalid user or password")
           
        }
    });
}
else{
res.send("invalid user or password")

}


   
      
})

function isLoggedIn(req,res,next){
    const token = req.cookies.token
    
    jwt.verify(token, 'shhhhh', function(err, decoded) {
        if(err){
return res.redirect("/login")

        }
        else{
            console.log(decoded) 
          
        }
      
    
      });

  

    
    }





app.listen(3000)
