import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';

function Home() {
	const [username, setUsername] = useState('');
	const [authenticated, setAuthentication] = useState('');

	useEffect(() => {
	axios.get('http://localhost:8000/home/')
		.then(response => {
			// console.log(response.data)
			const accessToken = localStorage.getItem('token');
			// console.log('toto ' + accessToken.username)
			// console.log(accessToken)
	
			// Decode access token to extract user information
			if (accessToken) {
				const user = JSON.parse(accessToken).username
				setUsername(user);
				setAuthentication(true)
			}
			
		})
		.catch(error => {
			console.log(error);
		});
	}, []);

	return (
		<div>
			<Navbar isAuth={authenticated}/>
			<div>
				<h2>Wellcome {username}</h2>
			</div>
				
		</div>
	);
}

export default Home;