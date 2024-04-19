// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import './css/authentication.css'

const RegistrationForm = () => {
	const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

	const handleSubmit = async (e) => {	
		e.preventDefault();
		try {
			const response = await axios.post('http://localhost:8000/signup/', {
				username,
                email,
                password,
			});
			console.log(response.data); // Assuming your backend sends back a token upon successful registration
            // Redirect the user to the login page or automatically log them in
			
		} catch (error) {
			console.error('Registration failed:', error);
            setError('Registration failed. Please try again.');
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
                        type="email"
                        id="email" placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit">Register</button>
                <p class="message">Already registered? <a href="/login">Sign In</a></p>
            </form>
        </div>
	);
};

function ReigistrationPage() {
	return (
		<>
			<div>
				<Navbar isAuth={false}/>
			</div>

			<div>
				<RegistrationForm />
			</div>
		</>
	);
}

export default ReigistrationPage;
