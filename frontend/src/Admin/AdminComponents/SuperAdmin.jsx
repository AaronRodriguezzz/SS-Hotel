import './SuperAdmin.css';
import { useEffect, useState, useRef } from 'react';

const SuperAdmin = () => {
    const [addAdminVisible, setFormVisibility] = useState(false);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [securityClearance, setSecurityClearance] = useState('');
    const [adminStatus, setAdminStatus] = useState('')
    const [adminInfo, setAdminInfo] = useState([]);

    const handleAddAdmin = (decision) => {
        setFormVisibility(decision)
    }

    /*useEffect(() => {
        const timer = setTimeout(() => {
            setVerificationCode('');
            alert("Verification ");
        }, 300000); // 5 minutes in milliseconds

        return () => clearTimeout(timer); // Cleanup on component unmount
    }, [verificationCode]); */

    const handleSubmit = async () => {

        try{
            const addAdmin = await fetch('/api/add/newadmin', {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {adminData: {
                        lastName,
                        firstName,
                        email,
                        contactNumber,
                        securityClearance,
                        adminStatus
                    },
                }),
            });

            const response = await addAdmin.json();

            console.log('Response Status:', response.status); // Debugging line
            console.log('Response Message:', response.message); // Debugging line

            // Check for success or failure based on status code
            if (addAdmin.status === 200) {
                alert('Add New Admin Successful\n The password is sent to the Email');
                handleAddAdmin(false);
            } else if (addAdmin.status === 404) {
                alert(response.message); // Email already registered error
            } else {
                alert('Warning: Failed to save the admin\n' + response.message); // Any other failure
            }

        }catch(err){
            console.log('submit error: ', err);
        }
    }   

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await fetch('/api/adminAll');

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setAdminInfo(data.admins);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAdminData();
    }, []);

    return(
        <>

            <div className="superAdmin-container">
                <button id='add-button' type='button' 
                        onClick={() => handleAddAdmin(true)}
                        style={{display: addAdminVisible ? "none" : "flex"}}
                >
                    <span>+</span> Add Admin
                
                </button>
                {addAdminVisible ? 
                   <div className="add-admin-form" style={{display: "flex"}}>
                        <div className="full-name">
                            <input type="text" 
                                    placeholder='Last Name'
                                    name='last-name'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                            />
                            

                            <input type="text" 
                                    placeholder='First Name'
                                    name='first-name'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                            />
                        </div>


                        <input type="email" 
                                placeholder='Email'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                        />

                        <input type="text" 
                                name='contact-number'
                                placeholder='Contact Number'
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                minLength={11}
                                maxLength={11}
                                required
                        />

                        <select name="security-clearance" id="clearance"
                                value={securityClearance}
                                onChange={(e) => setSecurityClearance(e.target.value)}
                                required
                        >

                            <option value="" selected disabled>Select Security Clerance</option>
                            <option value="Admin">Admin</option>
                            <option value="Super Admin">Super Admin</option>

                        </select>

                        <select name="status" id="status" 
                                value={adminStatus}
                                onChange={(e) => setAdminStatus(e.target.value)}
                                required
                        >

                            <option value="" selected disabled>Select Admin Status</option>
                            <option value="Enabled">Enabled</option>
                            <option value="Disabled">Disabled</option>

                        </select>
                        
                        <div className="form-buttons">
                            <button onClick={() => handleAddAdmin(false)} type='button' id='cancel'>CANCEL</button>
                            <button onClick={handleSubmit} type='button' id='submit'>SUBMIT</button>
                        </div>

                   </div> 
                   
                   :

                    <div className="super-admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Admin Name</th>
                                    <th>Admin Email</th>
                                    <th>Admin Contact</th>
                                    <th>Security Clearance</th>
                                    <th>Status</th>
                                    <th>Action</th>          
                                </tr>
                            </thead>
                            <tbody>
                                {adminInfo && adminInfo.map(admin => {
                                    return(
                                        <tr>
                                            <td>{admin.lastName}, {admin.firstName}</td>
                                            <td>{admin.email}</td>
                                            <td>{admin.contactNum}</td>
                                            <td>{admin.role}</td>
                                            <td>{admin.status}</td>
                                            <td>
                                                <button><img src="/photos/delete.png" alt="Delete" style={{width:"30px", height:"30px"}}/></button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                    
                            </tbody>
                        </table>
                    </div>
                }    
            </div>
            
        </>
    )
}

export default SuperAdmin;