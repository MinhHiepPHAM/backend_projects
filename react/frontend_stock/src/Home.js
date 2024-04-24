import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';

function Home() {
	const [username, setUsername] = useState('');
	const [authenticated, setAuthentication] = useState('');
	// const [message, setMessage] = useState('');

	useEffect(() => {
	axios.get('http://localhost:8000/home/')
		.then(response => {
			const name = localStorage.getItem('username');
			if (name) {
				setUsername(name);
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