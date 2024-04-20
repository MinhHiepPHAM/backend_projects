// import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
// import { useNavigate } from 'react-router-dom';


const LogoutMess = () => {
    // console.log('refresh: ' + localStorage.getItem('refresh_token') )
    // const navigate = useNavigate();

    try {
        axios.post('http://localhost:8000/logout/',
            {
                refresh_token:localStorage.getItem('refresh_token'),
                access_token:localStorage.getItem('access_token')
            }, {headers: {'Content-Type': 'application/json'}}, {withCredentials:true});

        // axios.defaults.headers.common['Authorization'] = null;
        localStorage.clear()
    } catch (error) {
        console.error('Logout failed:', error);
    }

    return (
        <>
            <p>Logout successful</p>
        </>
    )
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