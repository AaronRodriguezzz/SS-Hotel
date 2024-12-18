import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginStyle.css';

function AdminLogIn() {
    const [employeeEmail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogIn = async () => {
        try{
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeEmail, password }),
                credentials: 'include', // Ensures cookies are sent and accepted
            }); 

            const data = await response.json();
            if (data.token) {
                alert('Login successful');  
                navigate('/admin');
            } else {
                alert(data.message);
            }

        }catch(err){
            console.log('log in error:', err);
        }
    }

    const handle_fogetpassword = async () => {

        if(!employeeEmail){
            return alert('You need to put your email first')
        }

        console.log(employeeEmail)
        try{
            const response = await fetch(`/api/forget-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeEmail }),
            }); 

            if (response.ok) {
                const data = await response.json();
                alert(data.message || '');  
            }

        }catch(err){
            console.log('foget error', err);
        }
    }

    return(
        <div className='login-page'>
            <div className='cover-color'>
                <div className='login-container'>
                <h1><span>S</span>ILVERSTONE <span>H</span>OTEL</h1>
                    <input 
                        placeholder='EMAIL'
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
                    <button onClick={handle_fogetpassword}>Forgot Password</button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogIn;





