import { useEffect, useState,React } from 'react';
import "./ChatBot.css"; // Add styles here or inline

const FloatingButton = () => {

    const localMessages = localStorage.getItem("bot-messages");
    const [prompt, setPrompt] = useState('');  
    const [messages,setMessages] = useState(JSON.parse(localMessages) || [
        {
            sender: 'bot',
            message: 'I\'m a AI chatbot that can answer your inquiries and questions about SilverStone Hotel'
        }

    ]);
    const [containerVisibility, setContainerVisibility] = useState(false);

    const handleIconClicked = () => setContainerVisibility(!containerVisibility);

    const handleSend = async (e) => {
        e.preventDefault();

        if(prompt !== '' ){
            setPrompt('');
            const userPrompty = prompt;
            const addObject = {sender: 'user', message: userPrompty}
            setMessages(prev => {
                return [...prev, addObject]
            })
        
            try{
                const response = await fetch('/api/ask/chatbot', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt:userPrompty }), 
                });
        
                if(response.ok){
                    const data = await response.json();
                    const addObject = {sender:'bot', message: data.message}
                    setMessages(prev => { 
                        return [...prev, addObject]
                    });

                    localStorage.setItem("bot-messages", JSON.stringify(messages));
                }else{
                    alert('Check your internet connection')
                }
        
            }catch(err){
                console.log(err);
            }
        }
        
    }

    return (
        <>
            <form className="floating-container" style={{display: containerVisibility ? "flex":"none"}} onSubmit={handleSend}>
                <div className='title'>
                    <img src="./photos/chat-icon.gif" alt="bot logo" />
                    <p>Hello, I'm StoneBot</p>
                </div>
                <div className="message-container">
                    {messages.length > 0 && messages.map((text,index) =>  {
                        return(
                            <div className={text.sender === 'bot' ? 'bot' : 'user'} >
                                <p key={index}>{text.message.trim()}</p> 
                            </div>

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
                
            </form>

            <button className="floating-button" onClick={handleIconClicked}>
                <img id='bot-img' src="./photos/chat-icon.gif" alt="" />
            </button>
        </>
        
    );
};

export default FloatingButton;