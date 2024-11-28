import React, { useState } from 'react';
import './AdminLoginStyle.css';

function AdminLogIn() {
    const [employeeEmail, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleForgetPass = () => {
        
    }

    const handleLogIn = async () => {
        try{
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            }); 

            const data = await response.json();

            if (data.token) {
                console.log(data.token);
                localStorage.setItem('authToken', data.token);
                alert('Login successful');
            } else {
                alert(data.message);
            }
        }catch(err){

        }
    }

    return(
        <div className='login-page'>
            <div className='cover-color'>
                <div className='login-container'>
                <h1><span>S</span>ILVERSTONE <span>H</span>OTEL</h1>
                    <input 
                        placeholder='EMPLOYEE ID'
                        type='text' 
                        value={employeeEmail} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />

                    <input 
                        type='password' 
                        placeholder='UNIQUE PIN' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />

                    <button onClick={handleLogIn}>LOG IN</button>
                    <button onClick={handleForgetPass}>Forgot Password</button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogIn;





