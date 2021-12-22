import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/dietplanningdb", {
    useNewUrlParser:true,
    useUnifiedTopology: true
}, () => {
    console.log("Db connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const plansSchema = new mongoose.Schema({
    name: String,
    description: String,
    feature1: String,
    feature2: String,
    feature3: String,
    price: String
})



const User = new mongoose.model("User", userSchema)

const Package = new mongoose.model("Package", plansSchema)
var db

//Routes

app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            if(password ===user.password){
                res.send({message: "login successful", user:  user})
            }else {
                res.send({message: "password incorrect"})
            }
        }else{
            res.send("User not registered ")
        }
    })
})

app.post("/register", (req, res)=> {
    const {name, email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registered"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save( err => {
                if(err) {
                    res.send(err)
                }else{
                    res.send({ message: "Successfully Registered"})
                }
            })
        }
    })
    
})

app.get("/user", (req, res) => {
    User.find((error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })

  app.get("/packages", (req, res) => {
    Package.find((error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })

// app.get('/api/users', function(req,res) {
//     res.send("on users  page");
//     User.find({})
//     .exec(function(err, user) {
//         console.log("--working--");
//       if(err) {
//         res.send('error occured')
//         res.send('error occured')
//       } else {
//         console.log(user);
//         res.json(user);
//       }
//     });

// });



app.listen(9002,() => {
    console.log("BE started at port 9002")
    
})