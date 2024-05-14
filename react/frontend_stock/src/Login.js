// src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import { useNavigate } from 'react-router-dom';
import './css/authentication.css'

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
			},{headers: {'Content-Type': 'application/json'}}, {withCredentials:true});
			
			localStorage.clear()
			localStorage.setItem('access_token', response.data.access);
			localStorage.setItem('refresh_token', response.data.refresh);
			localStorage.setItem('username', response.data.username);
			axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['access']}`;
			navigate('/home');
		} catch (error) {
			console.error('Login failed:', error);
			setError('Invalid username or password');
		}
	};

	return (
		<div className='login-container'>
			{error && <p>{error}</p>}
			<form className='auth-form' onSubmit={handleSubmit}>
				<div>
					<input
						type="text"
						id="username" placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<input
						type="password"
						id="password" placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit">Login</button>
				<p class="message">Not registered? <a href="/signup">Create an account</a></p>
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
