import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import './css/table.css'
import { useParams } from 'react-router-dom';
import {CandleChart, VolumeChart} from './custom_tag/TickerChart';
import './css/chart.css'    
import PeriodOptions from './custom_tag/Periods';
import TickerNews from './custom_tag/TickerNews';

function Ticker() {
    const [authenticated, setAuthentication] = useState('');
    // const [username, setUsername] = useState('');
    const [period, setPeriod] = useState('1mo');
    const {symbol} = useParams();
    const [openPrice, setOpenPrice] = useState(0);
    const [closePrice, setClosePrice] = useState(0);
    const [volume, setVolume] = useState(0);
    const [item, setItem] = useState([]);
    // const [news, setNews] = useState([])
    const [tickerData, setTickerData] = useState([])

    useEffect(() => {
        const url = 'http://localhost:8000/tickers/' + symbol + '/' + period
        axios.get(url)
			.then(response => {
                const name = localStorage.getItem('username');
                if (name) {
					setAuthentication(true);
				}
				
                let stockPrices = JSON.parse(response.data.stock_prices)['data'];

                setItem(response.data.item);
                setTickerData(stockPrices);
                setClosePrice(stockPrices[stockPrices.length-1]['close']);
                setOpenPrice(stockPrices[stockPrices.length-1]['open'])
                setVolume(stockPrices[stockPrices.length-1]['volume'])
                // if (item.related_news !== undefined )
                // setNews(item.related_news)
            
                console.log('item:', item);
                console.log('news:', item.related_news)
			})
			.catch(error => {
				console.log(error);
			});
	}, [period, symbol]);

    return (
        <div>
            <Navbar isAuth={authenticated}/>
            <div className="table-container">
				<h2 className='title'>{item.symbol + ': ' + item.company} </h2> {/* </div>(<small style={change>0?{color:'green'}:{color:'red'}}>{change + ' %'}</small>)</h2> */}
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
					<li className="table-row">
                        <div className="col-symbol"><a href={'/tickers/?symbol='+item.symbol}>{item.symbol}</a></div>
                        <div className="col-company">{item.company}</div>
                        <div className="col-country" >{item.country}</div>
                        <div className="col-sector">{item.sector}</div>
                        <div className="col-industry">{item.industry}</div>
                        <div className="col-open">{openPrice}</div>
                        <div className="col-close" >{closePrice}</div>
                        <div className="col-volume">{volume}</div>
					</li>
				</ul>
			</div>
            <PeriodOptions setOption={setPeriod} defaultOption={period} />
            <div className='chart-container'>
                <CandleChart stockData={tickerData}/>
                <div></div>
                <VolumeChart stockData={tickerData}/>
            </div>
            <TickerNews news={item.related_news}/>

        </div>
    )
}

export default Ticker