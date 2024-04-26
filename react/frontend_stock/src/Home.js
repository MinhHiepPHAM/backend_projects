import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import Pagination from './custom_tag/Pagination';

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
			<div>
				<table>
					<thead>
					<tr>
						<th>Symbol</th>
						<th>Company</th>
						<th>Industry</th>
						<th>Country</th>
						<th>Close price</th>
					</tr>
					</thead>
					<tbody>
					{data.map(item => {
						return (
						<tr>
							<td>{item.symbol}</td>
							<td>{item.company}</td>
							<td>{item.industry}</td>
							<td>{item.country}</td>
							<td>{item.close_price}</td>
						</tr>
						);
					})}
					</tbody>
				</table>

				<Pagination
					currentPage={currentPage}
					totalCount={count}
					pageSize={pageSize}
					onPageChange={page => setCurrentPage(page)}
				/>
			</div>
				
		</div>
	);
}

export default Home;