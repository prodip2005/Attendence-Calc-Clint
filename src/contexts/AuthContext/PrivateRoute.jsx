import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()

    const location = useLocation()
    if (loading) {

        return <h2>Loading</h2>
    }


    if (user && user.email) {

        return children;
    }
    return <Navigate state={location.pathname} to="/login"></Navigate>


};

export default PrivateRoute;