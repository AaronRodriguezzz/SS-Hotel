import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

const fetchUserType = async (setUser) => {
    try {
        const response = await fetch('http://localhost:4001/protection',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        })
      if (response.ok) {
        const result = await response.json();
        setUser(result.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
};


const AdminRoute = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        await fetchUserType(setUser);
        setLoading(false);
      };
      fetchData();
    }, []);

    if (loading) {
      return null;
    }

    return user ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoute