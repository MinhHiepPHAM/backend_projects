import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import Pagination from './custom_tag/Pagination';
import './css/news.css'
import TickerFilter from './custom_tag/TickerSearch';
import TickerNews from './custom_tag/TickerNews';

function News() {
    const [authenticated, setAuthentication] = useState(false);
    const [pageSize, setPageSize] = useState(20);
	const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [count, setCount] = useState(0);
    const [news, setNews] = useState([]);
    
    useEffect (()=> {
        const queryParams = new URLSearchParams();
        if (currentPage !== 1) queryParams.append('p', currentPage.toString())
        queryParams.append ('search', searchQuery.toString());

        let url = `http://localhost:8000/news/?${queryParams.toString()}`;
        axios.get(url)
			.then(response => {
                const name = localStorage.getItem('username');
                if (name) {
					setAuthentication(true);
				}
				setCount(response.data.count);
                setPageSize(response.data.page_size);
                setNews(response.data.news);
                console.log(news);
			})
			.catch(error => {
				console.log(error);
			});
        


    }, [currentPage, searchQuery]); // news

    return (
        <div>
            <Navbar isAuth={authenticated}/>
            <TickerFilter
				setQuery={setSearchQuery}
                isInHome={false}
			/>
            <TickerNews news={news}/>
            <Pagination
                currentPage={currentPage}
                totalCount={count}
                pageSize={pageSize}
                onPageChange={page => setCurrentPage(page)}
			/>
        </div>
    )
}

export default News