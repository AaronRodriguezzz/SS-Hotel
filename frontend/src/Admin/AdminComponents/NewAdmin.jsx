import { useEffect,useState,} from 'react';
import './NewAdmin.css';

const NewAdmin = ({name}) => {
    const {adminName} = name;
    const [lastName, setLastName] = useState('');
    const [firstName,setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNum, setContactNum] = useState('');
    const [role, setRole] = useState('');
    const [adminStatus, setAdminStatus] = useState('');
    
    const handleSubmit = async () => {
        const dataToSend = {
            addedBy: adminName,
            lastName,
            firstName,
            email,
            contactNum,
            role,
            adminStatus
        }
        

        try{

            const response = await fetch('http://localhost:4001/new-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();

            if (response.status === 404) {
                alert(data.message || "Resource not found!");
            } else if (response.status === 500) {
                alert(data.message || "Server error occurred!");
            } else if (response.ok) {
                alert(data.message || "New admin added successfully!");
            } else {
                alert("Unexpected error occurred.");
            }

        }catch(err){
            console.log(err)
        }

    }

    return(
        <>  

        <div className="newAdmin-container">

            <h1>SilverStone Hotel New Admin</h1>
            <input 
                type="text"
                name="lastName"
                value={lastName}   
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
            />
            <input 
                type="text"
                name="firstName"
                value={firstName}
                onChange= {(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
            />
            <input 
                type="email"
                name="email"
                value={email}
                onChange= {(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input 
                type="text" 
                name="contactNum"
                value={contactNum}
                onChange= { (e) => setContactNum(e.target.value)}
                placeholder="Contact Number"
                minLength={11} maxLength={11}
            />
            <select name="role" value={role} onChange= {(e) => setRole(e.target.value)}>
                <option value="" disabled>Select Role</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
            </select>
            <select name="adminStatus" value={adminStatus} onChange= {(e) => setAdminStatus(e.target.value)}>
                <option value="" disabled>Select Status</option>
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
            </select>

            <button type='button' onClick={handleSubmit}>SUBMIT</button>

        </div>
        </>
    )
}

export default NewAdmin;