import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await fetch('http://localhost:4000/protection', {
                    method: 'GET',
                    credentials: 'include', // Ensures cookies are sent
                });

                if (response.ok) {
                    setIsAuthenticated(true); // Token is valid
                } else {
                    setIsAuthenticated(false); // Token is invalid or missing
                }
            } catch (error) {
                setIsAuthenticated(false); // Error occurred
            }
        };

        checkToken();
    }, []);

    // While the authentication status is being determined, show a loading spinner or nothing
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    // If authenticated, render the component
    return <Component {...rest} />;
};

export default ProtectedRoute;
