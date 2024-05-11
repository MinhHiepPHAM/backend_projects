import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import Pagination from './custom_tag/Pagination';
import './css/table.css'
import TickerFilter from './custom_tag/TickerSearch';

function Home() {
	// const [username, setUsername] = useState('');
	const [authenticated, setAuthentication] = useState('');
	const [pageSize, setPageSize] = useState(15);
	const [currentPage, setCurrentPage] = useState(1);
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [country, setCountry] = useState(false);
	const [company, setCompany] = useState(false);
	const [sector, setSector] = useState(false);
	const [industry, setIndustry] = useState(false);

	useEffect(() => {
		// console.log('current page: ' + currentPage)
		const queryParams = new URLSearchParams();
		if (currentPage !== 1) queryParams.append('p', currentPage.toString())
		queryParams.append ('search', searchQuery.toString());
		queryParams.append('country', country.toString());
		queryParams.append('sector', sector.toString());
		queryParams.append('industry', industry.toString());
		queryParams.append('company', company.toString());
		
		// console.log('query:', queryParams.toString())
		let url = `http://localhost:8000/home/?${queryParams.toString()}`;

		axios.get(url)
			.then(response => {
				const name = localStorage.getItem('username');
				if (name) {
					// setUsername(name);
					setAuthentication(true);
				}
				setData(response.data.all_stock_data);
				setPageSize(response.data.page_size)
				// setNumPages(response.data.num_pages);
				setCount(response.data.count);
				
			})
			.catch(error => {
				console.log(error);
			});
	}, [currentPage, searchQuery, company, country, sector, industry]);

	return (
		<div>
			<Navbar isAuth={authenticated}/>
			<TickerFilter
				setQuery={setSearchQuery}
				setCompany={setCompany}
				setCountry={setCountry}
				setSector={setSector}
				setIndustry={setIndustry}
			/>
			<div className="table-container">
				{/* <h2 className='title'> Ticket Price Info <small> ({count} tickers)</small></h2> */}
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