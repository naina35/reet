import React from 'react';
import {Navigate} from 'react-router-dom';
interface Props {
  children: React.ReactNode
}

function ProtectedRoute({children}:Props){

    const token=localStorage.getItem('accessToken')
    if(!token){
        return <Navigate to="/login"/> 
    }
    else return children;
}

export default ProtectedRoute;