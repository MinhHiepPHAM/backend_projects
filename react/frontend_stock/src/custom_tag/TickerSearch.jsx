import '../css/tickerSearch.css'

function TickerFilter({setQuery, setCompany, setCountry, setSector, setIndustry}) {
    const handleCheckBox = (event) => {
        const { name, checked } = event.target;
        // console.log('event:', name, checked)

        switch (name) {
            case 'company':
                setCompany(checked)
                break;
            case 'country':
                setCountry(checked)
                break;
            case 'sector':
                setSector(checked)
                break;
            case 'industry':
                setIndustry(checked)
        }

    }

    const handleInput = (event) => {
        setQuery(event.target.value)
    }

    return (
        <div className='search-container'>
            <div>
                <form className='query_form' action="">
                    <input className='query_input' type="search" placeholder='Filter ...' onChange={handleInput}/>
                </form>
            </div>
            <div className='checkbox'>
                <input type="checkbox" name="company" onChange={handleCheckBox}/>Company
            </div>
            <div className='checkbox'>
                <input type="checkbox" name="country" onChange={handleCheckBox}/>Country
            </div>
            <div className='checkbox'>
                <input type="checkbox" name="sector" onChange={handleCheckBox}/>Sector
            </div>
            <div className='checkbox'>
                <input type="checkbox"  name="industry" onChange={handleCheckBox}/>Industry
            </div>
        </div>
    );

}

export default TickerFilter

