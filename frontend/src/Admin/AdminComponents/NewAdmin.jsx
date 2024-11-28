import { useEffect,useState,} from 'react';
import './NewAdmin.css';

const NewAdmin = () => {

    const [addedBy, setAddedBy] = useState('Aaron')
    const [lastName, setLastName] = useState('');
    const [firstName,setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNum, setContactNum] = useState('');
    const [role, setRole] = useState('');
    const [adminStatus, setAdminStatus] = useState('');
    
    const handleSubmit = async () => {

        try{

            const dataToSend = {
                addedBy,
                lastName,
                firstName,
                email,
                contactNum,
                role,
                adminStatus
            }

            console.log(dataToSend);

            const response = await fetch('http://localhost:4000/new-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const data = await response.json();
            } else {
                console.log('Failed to fetch room availability');
            }

        }catch(err){
            console.log(err)
        }

    }
    return(
        <>  

        <form className="newAdmin-container" onSubmit={handleSubmit}>

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

            <button type='submit'>SUBMIT</button>

        </form>
        </>
    )
}

export default NewAdmin;