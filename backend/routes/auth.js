const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'faisalisagoodboy'


// ROUTE 1: Create a user using: POST "/api/auth/createuser". Doesn't login require Auth 
//For Create
// router.get('/', (req, res)=>{
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('email', 'password must be atleast must be 5 characters').isLength({min: 5}),
] , async (req, res)=>{
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
    //  check whether the user with this email exists already
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: "Sorry a user with this email already exists"})
    }
  // for secure password using hash,salt,and peper 
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
    // password: req.body.password,
      });
      
    //   .then(user => res.json(user))
    //   .catch(err=> {console.log(err)
    //    res.json({error: 'Please enter a unique value for email', message: err.message})})
    // res.json({"Nice": "nice"})


    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    console.log(jwtData);

    // res.json(user)
    res.json({authtoken})

} catch (error) {
 console.error(error.message);
 res.status(500).send("Internal Server Errors");
}

    // res.send("Hello!");
    // res.send(req.body);
})


// ROUTE 2: Authentication a User using: POST "/api/auth/login". NO login required 
//For Login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password Cannot be blank').exists(),
] , async (req, res)=>{

  //if there are errors, return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user){
    return res.status(400).json({error: "Please try to login with correct credentials"});
    }

    //Compare Method
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
    return res.status(400).json({error: "Please try to login with correct credentials"});
    }

    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({authtoken})

} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Errors");
   }
})


// ROUTE 3: Get loggedin User details using: POST "/api/auth/getuser". login required 
//Start 51 Tutorial here: Creating a middleware to decode user from a JWT

router.post('/getuser', fetchuser, async (req, res)=>{

try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Errors");
   }
})



module.exports = router


