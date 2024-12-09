import './EmailVerify.css';
import NavBar from '../Components/NavBar';
import { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';

function VerifyEmail() {
    const location = useLocation();
    const [stateData, setStateData] = useState(null);
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
        if(location.state){
            setStateData(location.state);
        }
    },[location.state]);

    useEffect(() => {
        if(code){
            console.log('code to compare', code);
        }
    },[code])

    const handleResendCode = () => {
        alert('New verification code sended to your gmail');
        setTimeLeft(2*60);
        setResendIsClicked(true);
        setTimeFinished(false);
    }

    const handleChangeEmail = () => {

    }

    useEffect(() => {

        if (stateData) {
            const sendCode = async () => {
              try {
                const response = await fetch(`/api/send_code/${stateData.email}`);
                const data = await response.json();
                setCode(String(data.code)); // Set the code after fetching it
              } catch (err) {
                console.error('Error sending email:', err);
              }
            };
        
            sendCode();
        }

    }, [resendIsClicked,stateData]);
      

    useEffect( () => {
        const validate = async () => {
            if(numOne && numTwo && numThree && numFour && code !== 0){
                const inputCode = numOne + numTwo + numThree + numFour; 
                if(inputCode == String(code)){

                    try{
                        const response = await fetch('/api/payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json' 
                            },
                            credentials: 'include',
                            body: JSON.stringify(stateData)
                        });
                        console.log(response)
                        if(response.ok){
                            const result = await response.json();
                            window.location.href = result.data.attributes.checkout_url;
                        }
                    }catch(err){
                        console.error(err)
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