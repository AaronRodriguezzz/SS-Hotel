import { useEffect, useState,React } from 'react';
import "./ChatBot.css"; // Add styles here or inline

const FloatingButton = () => {

  const [prompt, setPrompt] = useState('');  
  const [messages,setMessages] = useState([]);
  const [containerVisibility, setContainerVisibility] = useState(false);

  const handleIconClicked = () => {
    if(containerVisibility){
        setContainerVisibility(false);
    }else{
        setContainerVisibility(true);
    }
  }

  const handleSend = async () => {

    const addObject = {sender: 'user', message: prompt}
    setMessages(prev => {
        return [...prev, addObject]
    })



    try{
        const response = await fetch('/api/ask/chatbot', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }), 
        });

        if(response.ok){
            const data = await response.json();
            const addObject = {sender:'bot', message: data.message}
            setMessages(prev => { 
                return [...prev, addObject]
            });
            
            setPrompt('');
        }else{
            alert('failde')
        }

    }catch(err){
        console.log(err);
    }
  }

  return (
    <>
        <div className="floating-container" style={{display: containerVisibility ? "flex":"none"}}>
            <div className='title'><p>Hello, I'm SilverBot at your service</p></div>
            <div className="message-container">
                {messages.length > 0 && messages.map((text,index) =>  {
                    return(
                        <p className='user-response' key={index} style={{marginLeft: index % 2 !== 0 ? "0px": "125px"}}>{text.message.trim()}</p> 
                    )
                })} 
            </div>
            

            <div className="input-send-container">
                <input type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Ask your question...'
                        required
                />
                <button onClick={handleSend}><img src="./photos/send3.png" alt="" /></button>
            </div>
            
        </div>

        <button className="floating-button" onClick={handleIconClicked}>
            <img src="./photos/bot.png" alt="" />
        </button>
    </>
    
  );
};

export default FloatingButton;