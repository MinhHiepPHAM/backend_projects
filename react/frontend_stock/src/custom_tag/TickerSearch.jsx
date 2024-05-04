import '../css/tickerSearch.css'

function TickerSearch({setQuery}) {
    const handleInput = (event) => {
        setQuery(event.target.value)
    }
    return (
        <div className='search-container'> 
            <form className='query_form' action="">
                <input className='query_input' type="search" placeholder='Filter ...' onChange={handleInput}/>
            </form>
        </div>
   );
}

export default TickerSearch