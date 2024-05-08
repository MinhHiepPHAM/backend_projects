import React from 'react';
import '../css/news.css'

const TickerNews = ({news}) => {

    if (news === undefined) return (<></>)
    return (
        <div className='news-container'>
            <h2>News</h2>
            {news.map(item => { 
                return (
                    <div >
                        <a href={item.url} className="news-link">{item.headline}</a><br></br>
                        <p>{item.context.substring(0,300)}</p>
                    </div>
                )
            })}
        </div>
    );
}

export default TickerNews;