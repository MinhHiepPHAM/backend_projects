import React from 'react';
import '../css/news.css'

const TickerNews = ({news}) => {

    if (news === undefined) return (<></>)
    return (
        <div className='news-container'>
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