import { useEffect,useState,} from 'react';
import './NewAdmin.css';

const NewAdmin = () => {

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        email: "", 
        contactNum: "", 
        role: "", 
        adminStatus: ""
    });
    
    const handleSubmit = async () => {

        try{

            const response = await fetch('http://localhost:4000/history');
            
        }catch(err){

        }

    }
    return(
        <>  

        <div className="newAdmin-container">

        <input 
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={ setFormData((prev) => ({ ...prev, lastName: e.target.value }))
        }
            placeholder="Last Name"
            required
        />
        <input 
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange= { setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
            placeholder="First Name"
            required
        />
        <input 
            type="email"
            name="email"
            value={formData.email}
            onChange= { setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            required
        />
        <input 
            type="text" 
            name="contactNum"
            value={formData.contactNum}
            onChange= { setFormData((prev) => ({ ...prev, contactNum: e.target.value }))}
            placeholder="Contact Number"
            minLength={11} maxLength={11}
        />
        <select name="role" value={formData.role} onChange= { setFormData((prev) => ({ ...prev, role: e.target.value }))}>
            <option value="" disabled>Select Role</option>
            <option value="Super Admin">Super Admin</option>
             <option value="Admin">Admin</option>
        </select>
        <select name="adminStatus" value={formData.adminStatus} onChange= { setFormData((prev) => ({ ...prev, status: e.target.value }))}>
            <option value="" disabled>Select Status</option>
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
        </select>

            <button type='button' onClick={handleSubmit}>Submit</button>

        </div>
        </>
    )
}

export default NewAdmin