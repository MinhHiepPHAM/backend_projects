import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import './css/table.css'
import { useParams } from 'react-router-dom';

function Ticker() {
    const [authenticated, setAuthentication] = useState('');
    // const [username, setUsername] = useState('');
    const [period, setPeriod] = useState('1d');
    const {symbol} = useParams();
    const [change, setChange] = useState(0);
    const [item, setItem] = useState([]);
    // console.log('symbol: '+ symbol)
    


    useEffect(() => {
        const url = 'http://localhost:8000/tickers/' + symbol + '/' + period
        axios.get(url)
			.then(response => {
                const name = localStorage.getItem('username');
                if (name) {
					// setUsername(name);
					setAuthentication(true);
				}
				// console.log('response: ' + typeof(response.data.stock_prices))
                let data = JSON.parse(response.data.stock_prices)['data'];
                // console.log('price:', JSON.parse(response.data.stock_prices)['data'])

                // console.log('data', data)
                setItem(response.data.item);
                let close_price, prev_close_price;
                close_price = data[data.length-1]['Close'];
                prev_close_price = data[data.length-2]['Close'];
                
                setChange( ((close_price-prev_close_price)*100/prev_close_price).toFixed(2) );
			})
			.catch(error => {
				console.log(error);
			});
	}, [period]);

    return (
        <div>
            <Navbar isAuth={authenticated}/>
            <div className="table-container">
				<h2 className='title'>{item.symbol + ': ' + item.company} (<small style={change>0?{color:'green'}:{color:'red'}}>{change + ' %'}</small>)</h2>
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
				</ul>
			</div>

        </div>
    )
}

export default Ticker