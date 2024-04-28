import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import Pagination from './custom_tag/Pagination';
import './css/table.css'

function Home() {
	const [username, setUsername] = useState('');
	const [authenticated, setAuthentication] = useState('');
	const [pageSize, setPageSize] = useState(20);
	const [currentPage, setCurrentPage] = useState(1);
	const [numPages, setNumPages] = useState(0);
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);

	useEffect(() => {
		console.log('current page: ' + currentPage)
		let url;
		if (currentPage !== 1) {
			url = 'http://localhost:8000/home/?p=' + currentPage;
		} else {
			url = 'http://localhost:8000/home/'
		}
		axios.get(url)
			.then(response => {
				const name = localStorage.getItem('username');
				if (name) {
					setUsername(name);
					setAuthentication(true)
				}
				setData(response.data.all_stock_data)
				setPageSize(response.data.page_size)
				setNumPages(response.data.num_pages)
				setCount(response.data.count)
				
			})
			.catch(error => {
				console.log(error);
			});
	}, [currentPage]);

	return (
		<div>
			<Navbar isAuth={authenticated}/>
			<div className="table-container">
				<h2 className='title'> Ticket Price Info <small> ({count} tickers)</small></h2>
				<ul className="responsive-table">
					<li className="table-header">
						<div className="col col-symbol">Ticker</div>
						<div className="col col-company">Company</div>
						<div className="col col-country">Country</div>
						<div className="col col-sector">Sector</div>
						<div className="col col-industry">Industry</div>
						<div className="col col-open">Open price</div>
						<div className="col col-close">Close price</div>
						<div className="col col-volume">Volume</div>
					</li>
					{data.map(item => {
						return  (
							<li className="table-row">
								<div className="col col-symbol"><a href={'/tickers/'+item.symbol}>{item.symbol}</a></div>
								<div className="col col-company">{item.company}</div>
								<div className="col col-country" >{item.country}</div>
								<div className="col col-sector">{item.sector}</div>
								<div className="col col-industry">{item.industry}</div>
								<div className="col col-open">{item.open_price}</div>
								<div className="col col-close" >{item.close_price}</div>
								<div className="col col-volume">{item.volume}</div>
							</li>
						)
					})}
				</ul>
			</div>

				<Pagination
					currentPage={currentPage}
					totalCount={count}
					pageSize={pageSize}
					onPageChange={page => setCurrentPage(page)}
				/>
				
		</div>
	);
}

export default Home;