import React, { useState } from 'react';
import './AdminLoginStyle.css';

function AdminLogIn() {
    const [employeeId, setEmpId] = useState('');
    const [password, setPassword] = useState('');

    const handleForgetPass = () => {
        
    }

    return(
        <div className='login-page'>
            <div className='cover-color'>
                <div className='login-container'>
                <h1><span>S</span>ILVERSTONE <span>H</span>OTEL</h1>
                    <input 
                        placeholder='EMPLOYEE ID'
                        type='text' 
                        value={employeeId} 
                        onChange={(e) => setEmpId(e.target.value)} 
                        required 
                    />

                    <input 
                        type='password' 
                        placeholder='UNIQUE PIN' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />

                    <button >LOG IN</button>
                    <button onClick={handleForgetPass}>Forgot Password</button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogIn;





