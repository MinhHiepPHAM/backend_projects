// src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {	
		e.preventDefault();
		try {
			const response = await axios.post('http://localhost:8000/login/', {
				username,
				password,
			});
			localStorage.setItem('token', JSON.stringify(response.data))
			console.log(response.data); // assuming your backend sends back a token upon successful login
			navigate('/home');
		} catch (error) {
			console.error('Login failed:', error);
			setError('Invalid username or password');
		}
	};

	return (
		<div>
			<h2>Login</h2>
			{error && <p>{error}</p>}
			<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="username">Username:</label>
				<input
					type="text"
					id="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor="password">Password:</label>
				<input
					type="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<button type="submit">Login</button>
			</form>
		</div>
	);
};

function LoginPage() {

	return (
		<>
			<div>
				<Navbar isAuth={false}/>
			</div>

			<div>
				<LoginForm />
			</div>
		</>
	)

}

export default LoginPage;
