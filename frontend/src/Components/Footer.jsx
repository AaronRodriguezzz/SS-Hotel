import React, { forwardRef } from 'react';
import './FooterStyle.css'


const footer = forwardRef((_, ref) => {
    return(
        <div className='footer' >
            <img src='/photos/logo.png' alt='Logo' />
            <button>TERMS AND CONDITIONS</button>        

            <div className='social-medias' ref={ref}>
                <button><img src='/photos/facebook.png' alt='Facebook' /></button>        
                <button><img src='/photos/mail.png' alt='Mail' /></button>    
                <button><img src='/photos/instagram.png' alt='Mail' /></button>                         
                <button><img src='/photos/tiktok.png' alt='Mail' /></button>                                              
            </div>
        </div>
    )
});

export default footer;