// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';

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
		<div>
            <h2>Register</h2>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit">Register</button>
            </form>
        </div>
	);
};

function ReigistrationPage() {
	return (
		<>
			<div>
				<Navbar/>
			</div>

			<div>
				<RegistrationForm />
			</div>
		</>
	);
}

export default ReigistrationPage;
