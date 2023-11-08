const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
var screctKey = "jwtKeyVa$tsal";
  
//Route1 : create a user using POST '/api/auth/createuser'
router.post('/createuser', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .custom(async (value) => {
        const existingUser = await checkIfEmailExistsInDatabase(value);
        if (existingUser) {
          throw new Error('Email already in use');
        }
        return true;
      }),
    body('name', 'Enter a valid name').notEmpty(),
    body('password', 'Passowrd must be atleast 6 characters').isLength({ min: 6 })
], async (req, res)=> {
    const errors = validationResult(req);
    //check bad request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const salt = await bcrypt.genSaltSync(10);
        secPass = await bcrypt.hash(req.body.password, salt);
        //create new user
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        res.json({message : "User created successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//check email address exists or not
async function checkIfEmailExistsInDatabase(email) {
    const existingUser = await User.findOne({ email });
    return existingUser;
}

//Route2 authticate a user using POST '/api/auth/login'
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password', 'Passowrd cannot be blank').exists()
], async (req, res)=> {
    const errors = validationResult(req);
    //check bad request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({error : "Please try to login with correct credentials"});
        }
        const passCompre = await bcrypt.compare(password, user.password);
        if (!passCompre) {
            return res.status(400).json({error : "Please try to login with correct credentials"});
        }
        const data = {
            user: {
                id : user.id
            }
        }
        const authToken = jwt.sign(data, screctKey);
        res.json({authToken : authToken});
    } catch(error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route3 get loggedin user deatils using api/auth/getuser login requried
router.post('/getuser', fetchuser, async (req, res)=> {
    try {
        userId = req.user.id;
        let user = await User.findById(userId).select("-password");
        res.send({user: user});
    } catch(error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
  
module.exports = router