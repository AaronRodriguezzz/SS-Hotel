import './EmailVerify.css';
import NavBar from '../Components/NavBar';
import { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';

function VerifyEmail() {
    const location = useLocation();
    const dataToSend = location.state;
    const [timeLeft, setTimeLeft] = useState(2 * 60);
    const [timeFinished, setTimeFinished] = useState(false);
    const [resendIsClicked, setResendIsClicked] = useState(false);
    const [numOne,setNumOne] = useState('');
    const [numTwo,setNumTwo] = useState('');
    const [numThree,setNumThree] = useState('');
    const [numFour,setNumFour] = useState('');
    const [code, setCode] = useState('');

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleResendCode = () => {
        alert('New verification code sended to your gmail');
        setTimeLeft(2*60);
        setResendIsClicked(true);
        setTimeFinished(false);
    }

    const handleChangeEmail = () => {

    }

    useEffect(() => {

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if(prevTime <= 1){
                    setTimeFinished(true);
                } 

                return prevTime - 1;
            })
            
        }, 1000);

        return () => clearInterval(timerId);

    }, [resendIsClicked]);

    useEffect(() => {
        const sendCode = async () => {
            
            if (dataToSend) {

                const email = dataToSend.email;

                try {
                    const response = await fetch(`http://localhost:4001/send_code/${email}`);
            
                    const data = await response.json();
                    console.log('code from backend ' , data);
                    setCode(String(data.code));

                } catch (err) {
                    console.error('Error sending email:', err);
                }
                
            }
        };
      
        sendCode();
    }, [resendIsClicked, dataToSend]);
      

    useEffect( () => {
        const validate = async () => {

            if(numOne && numTwo && numThree && numFour && code !== 0){
                const inputCode = numOne + numTwo + numThree + numFour; 
                console.log('inputCode: ', inputCode + 'code: ',  );
                
                console.log('isTrue' , inputCode === String(code));

                if(inputCode === String(code)){
    
                    const response = await fetch('http://localhost:4001/api/payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json' 
                        },
                        credentials: 'include',
                        body: JSON.stringify(dataToSend)
                    });
    
                    if(response.ok){
                        const result = await response.json();
                        window.location.href = result.data.attributes.checkout_url;
                    }
    
                }
            }

        }
        
        validate();

    },[numOne, numTwo, numThree, numFour,code])

    return(
        <>
          <NavBar />
          <div className="verification_page">
            <div className="verify_container">
                <p id='verification_title'>Input 4 digit code</p>

                <div className="input_fields">
                    <input type="text" 
                            value={numOne}
                            onChange={(e) => setNumOne(e.target.value )}
                            minLength={1}
                            maxLength={1}
                            required
                    />

                    <input type="text" 
                            value={numTwo}
                            onChange={(e) => setNumTwo(e.target.value )}
                            minLength={1}
                            maxLength={1}
                            required
                    />

                        <input type="text" 
                            value={numThree}
                            onChange={(e) => setNumThree(e.target.value )}
                            minLength={1}
                            maxLength={1}
                                required
                    />

                    <input type="text" 
                            value={numFour}
                            onChange={(e) => setNumFour(e.target.value )}
                            minLength={1}
                            maxLength={1}
                            required
                    />
                </div>
                

                <p>Didn't receive the code? {timeFinished ? <a onClick={handleResendCode}>Resend Code</a> : formatTime()}</p>
                <a onClick={handleChangeEmail}>Change Email</a>

            </div>
        </div>
        </>
        
    )
}

export default VerifyEmail;