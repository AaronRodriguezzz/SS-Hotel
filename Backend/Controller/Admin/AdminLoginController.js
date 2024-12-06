const Admin = require('../../Models/AdminSchemas/AdminSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());


const adminLogin = async (req,res) => {
    const { employeeEmail: email , password } = req.body; // Retrieve credentials from the request body

    try {
        // Find the user by profId
        const admin = await Admin.findOne({email});

        if (!admin) {
            return res.status(404).json('Admin ID does not exist');
        }

        // Compare the entered password with the stored hashed password
        const passMatched = await bcrypt.compare(password, admin.password);

        if (!passMatched) {
            return res.status(400).json({message:"Log In Failed"});
        } 

        const token = jwt.sign(
            { email: admin.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' } 
        );

        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'lax' }); 

        // Send back the token and any other relevant info
        return res.status(200).json({
            message: 'Login successful',
            token: token, // Send JWT token
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error Log in');
    }
 }

 const getToken = (req, res) => {
    try {
        const token  = req.cookies.jwt;

        if(!token){
            return res.status(401).json({ message: 'Token invalid'});
        }
        console.log(token)
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: 'Token valid', user: verified });
    } catch (err) {
        console.error('Getting token error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    adminLogin,
    getToken
}