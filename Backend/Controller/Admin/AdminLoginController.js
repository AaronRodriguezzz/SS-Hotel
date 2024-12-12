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
            return res.status(404).json('Admin does not exist');
        }

        if(admin.adminStatus === 'Disabled'){
            return res.status(404).json('Your Account is disabled');
        }

        // Compare the entered password with the stored hashed password
        const passMatched = await bcrypt.compare(password, admin.password);

        if (!passMatched) {
            return res.status(400).json({message:"Log In Failed"});
        } 

        const token = jwt.sign(
            { email: admin.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
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

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: 'Token valid', user: verified });
    } catch (err) {
        console.error('Getting token error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const deleteToken = (req, res) => {
    try {

        res.clearCookie('jwt', { 
            httpOnly: true, 
            sameSite: 'lax',  
            path: '/',  
        });        
        
        return res.status(200).json({message: 'Successfully Log Out'});
        
    } catch (err) {
        console.error('Deleting token error:', err.message);
        return res.status(500).json({ message: 'Log out function error' });
    }
};


const check_clearance = async (req,res) => {
    try{
        const token  = req.cookies.jwt;

        if(!token){
            return res.status(401).json({ message: 'No token found'});
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({email: decodedToken.email});

        if(!admin){
            res.status(404).json({message: 'Admin not found'});
        }

        const fullName = admin.firstName + admin.lastName;
        console.log(admin.role)
        return res.status(200).json({clearance: admin.role, name:fullName })
    }catch(err){    
        console.log(err);
    }
}


module.exports = {
    adminLogin,
    getToken,
    deleteToken,
    check_clearance
}