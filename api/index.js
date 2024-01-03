const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const User = require('./models/Users')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const PORT = process.env.PORT || 8080;
dotenv.config();
async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/chatApp");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
// const jwtSecret = process.env.JWT_SECRET;
const jwtSecret = "sxrdctfvgybhctrfvygbhjnkmgfhbj";
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.get('/test', (req, res) => {
    res.json('test ok');
});


app.get('/profile', (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData)
    })
  }
  else {
    res.status(401).json('no token')
  }
})

app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username })
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password)
    if (passOk) {
      jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
        res.cookie('token', token).json({
          id: foundUser._id
        })
      })
    }
  }
})

app.post('/register', async(req, res) => {
    const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
      const createdUser = await User.create({
        username: username,
        password: hashedPassword,
       });
         jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
           if (err) throw err;
           res.cookie("token", token).status(201).json({
             _id: createdUser._id,
           });
         });
    }
    catch (err) {
        if (err) throw err;
    }
   
    
})

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
