import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';

function Home() {
	const [data, setData] = useState('');
	useEffect(() => {
	axios.get('http://localhost:8000/home/')
		.then(response => {
			setData(response.data)
		})
		.catch(error => {
			console.log(error);
		});
	}, []);

	return (
		<div>
			<Navbar isAuth={false}/>
			<div>
				{JSON.stringify(data)}
			</div>
				
		</div>
	);
}

export default Home;