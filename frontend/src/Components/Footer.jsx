import React, { forwardRef } from 'react';
import './FooterStyle.css'


const footer = forwardRef((_, ref) => {
    return(
        <div className='footer' >
            <img src='/photos/logo.png' alt='Logo' />
            <button><a href="/terms-and-conditions">TERMS AND CONDITIONS</a></button>        

            <div className='social-medias' ref={ref}>
                <button onClick={() => window.location.href = 'https://www.facebook.com/profile.php?id=61570708011920&mibextid=ZbWKwL'}><img src='/photos/facebook.png' alt='Facebook' /></button>        
                <button onClick={() => window.location.href = 'https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSKhbmFgWXhGMDQvjmBLZfwPklKZFWJqGdnDNmXDflxCjNVcmLwfzzhXnmckTrCvGHsVTdNw'}><img src='/photos/mail.png' alt='Mail' /></button>    
                <button onClick={() => window.location.href = 'https://www.tiktok.com/@silverstoneofficial2024?_t=8sEuaBS5esc&_r=1'}><img src='/photos/instagram.png' alt='Mail' /></button>                         
                <button onClick={() => window.location.href = 'https://www.tiktok.com/@silverstoneofficial2024?_t=8sEuaBS5esc&_r=1'}><img src='/photos/tiktok.png' alt='Mail' /></button>                                              
            </div>
        </div>
    )
});

export default footer;