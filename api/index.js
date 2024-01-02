const express = require('express');
const mongoose = require("mongoose");
const User = require('./models/Users')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const cors = require('cors');
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

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    try {
        const createdUser = await User.create({ username, password });
         jwt.sign({ userId: createdUser._id }, jwtSecret, {}, (err, token) => {
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
