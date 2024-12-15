import './EmailVerify.css';
import NavBar from '../Components/NavBar';
import { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';
import FloatingButton from '../Components/ChatBot';

function VerifyEmail() {
    const location = useLocation();
    const {clientData, rooms} = location.state || {};
    const [stateData, setStateData] = useState({
        fullName: '',
        email: '',
        phoneNumber: ''
    });
    const [timeLeft, setTimeLeft] = useState(2 * 60);
    const [timeFinished, setTimeFinished] = useState(false);
    const [resendIsClicked, setResendIsClicked] = useState(false);
    const [numOne,setNumOne] = useState('');
    const [numTwo,setNumTwo] = useState('');
    const [numThree,setNumThree] = useState('');
    const [numFour,setNumFour] = useState('');
    const [code, setCode] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [changeEmailClicked, setChangeEmailClicked] = useState(false);

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
        if(clientData){
            setStateData({
                fullName: clientData.fullName || '',
                email: clientData.email || '',
                phoneNumber: clientData.phoneNumber || '',
            });
        }
    },[clientData]);

    useEffect(() => {
        if(code){
            console.log('code to compare', code);
        }
    },[code])

    useEffect(() => {
        if(code){
            console.log('state', stateData);
        }
    },[stateData])

    const handleResendCode = () => {
        alert('New verification code sended to your gmail');
        setTimeLeft(2*60);
        setResendIsClicked(!resendIsClicked);
        setTimeFinished(false);
    }

    const handleChangeEmail = () => {
        setStateData(prevState => ({
            ...prevState, // Keep other fields unchanged
            email: newEmail // Update email only
        }));

        setChangeEmailClicked(!changeEmailClicked)
    }

    useEffect(() => {
        if (stateData?.email) {
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

    }, [resendIsClicked,stateData.email]);
      

    useEffect( () => {
        const validate = async () => {
            if(numOne && numTwo && numThree && numFour && code !== 0){
                const inputCode = numOne + numTwo + numThree + numFour; 
                if(inputCode == String(code)){

                    const objectToSend = {stateData, rooms}
                    console.log(objectToSend)
                    try{
                        const response = await fetch('/api/payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json' 
                            },
                            credentials: 'include',
                            body: JSON.stringify(objectToSend)
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
          <FloatingButton/>
          <div className="verification_page">
            {!changeEmailClicked ? (
            
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
                    <a onClick={() => setChangeEmailClicked(!changeEmailClicked)}>Change Email</a>

                </div>

            ) : (
                <form className="change-email-form" onSubmit={handleChangeEmail}>
                    <input type="email" 
                            placeholder='New Email'
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                    />

                    <button type='submit'>SUBMIT</button>
                </form>
            )
}
            
        </div>
        </>
        
    )
}

export default VerifyEmail;