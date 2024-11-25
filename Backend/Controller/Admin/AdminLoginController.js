const Admin = require('../../Models/AdminSchemas/AdminSchema');

const adminLogin = async (req,res) => {
    const { adminId , password } = req.body; // Retrieve credentials from the request body

    try {
        // Find the user by profId
        const admin = await Admin.findOne(adminId);

        if (!admin) {
            return res.status(404).json('Admin ID does not exist');
        }

        // Compare the entered password with the stored hashed password
        const passMatched = await bcrypt.compare(password, admin.password);

        if (!passMatched) {
            return res.status(200).json({message:"Log In Successful"});
        } 

        const maxAge = 1 * 24 * 60 * 60;         
        const createToken = (adminId) => {
            return jwt.sign({ adminId }, 'aaron', {
                expiresIn: maxAge
            });
        } 

        const token = createToken(adminId);
        res.cookie('jwt', token, { httpOnly: true, maxAge});


        const today = new Date().toISOString().split('T')[0];
        const updatedAdmin = await Admin.updateOne({ adminId: adminId }, today);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error Log in');
    }
 }


 const NewAdmin = async (req, res) => {
    const {adminId, password} = req.body
    try{

        const admin = new Admin.findOne(adminId);

        if(admin){
            res.status(404).json({message:'This ID already exist'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const AdminObject = {...req.body};
        const {password:_, ...AdminInfo } = AdminObject;



        const newAdmin = new Admin({
            ...AdminInfo,
            password: hashedPassword
        })

        await newAdmin.save();
        res.status(200).json({message: 'New Admin Added'});
        
    }catch(err){
        res.status(404).json({message:err})
    }
 }