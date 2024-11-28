const Admin = require('../../Models/AdminSchemas/AdminSchema');

const adminLogin = async (req,res) => {
    const { email , password } = req.body; // Retrieve credentials from the request body

    try {
        // Find the user by profId
        const admin = await Admin.findOne(email);

        if (!admin) {
            return res.status(404).json('Admin ID does not exist');
        }

        // Compare the entered password with the stored hashed password
        const passMatched = await bcrypt.compare(password, admin.password);

        if (!passMatched) {
            return res.status(200).json({message:"Log In Failed"});
        } 

        const token = jwt.sign(
            { email: admin.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' } 
        );

        console.log('token' , token);

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

module.exports = adminLogin