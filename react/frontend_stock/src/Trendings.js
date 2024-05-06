import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import './css/table.css'

function Trendings() {
	const [authenticated, setAuthentication] = useState('');
	const [data, setData] = useState([]);

	useEffect(() => {		
		axios.get('http://localhost:8000/trendings/')
			.then(response => {
				const name = localStorage.getItem('username');
				if (name) {
					setAuthentication(true);
				}
				setData(response.data);
			})
			.catch(error => {
				console.log(error);
			});
	}, []);

	return (
		<div>
			<Navbar isAuth={authenticated}/>
			<div className="table-container">
            <h2 className='title'>Trending Tickers</h2>
				<ul className="responsive-table">
					<li className="table-header">
						<div className="col-symbol">Ticker</div>
						<div className="col-company">Company</div>
						<div className="col-country">Country</div>
						<div className="col-sector">Sector</div>
						<div className="col-industry">Industry</div>
						<div className="col-open">Open price</div>
						<div className="col-close">Close price</div>
						<div className="col-volume">Volume</div>
					</li>
					{data.map(item => {
						return  (
							<li className="table-row">
								<div className="col-symbol"><a href={'/tickers/'+item.symbol}>{item.symbol}</a></div>
								<div className="col-company">{item.company}</div>
								<div className="col-country" >{item.country}</div>
								<div className="col-sector">{item.sector}</div>
								<div className="col-industry">{item.industry}</div>
								<div className="col-open">{item.open_price}</div>
								<div className="col-close" >{item.close_price}</div>
								<div className="col-volume">{item.volume}</div>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	);
}

export default Trendings;