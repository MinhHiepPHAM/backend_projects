// import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
// import { useNavigate } from 'react-router-dom';


const LogoutMess = () => {
    // const navigate = useNavigate();

    try {
        axios.post('http://localhost:8000/logout/',
            {
                refresh_token:localStorage.getItem('refresh_token'),
                access_token:localStorage.getItem('access_token')
            }, {headers: {'Content-Type': 'application/json'}}, {withCredentials:true});

        axios.defaults.headers.common['Authorization'] = null;
        localStorage.clear()
        return (
            <>
                <h2>Successfully logout</h2>
            </>
        )
    } catch (error) {
        console.error('Logout failed:', error);
        // setMessage('Logout failed: ');
        return error
    }
}

function LogoutPage() {
    return (
		<>
			<div>
				<Navbar isAuth={false}/>
			</div>

			<div>
				<LogoutMess />
			</div>
		</>
	)
}

export default LogoutPage;