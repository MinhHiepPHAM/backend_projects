import React, { useState } from 'react';
import '../css/periodSelect.css'

const PeriodOptions = ({setOption, defaultOption}) => {
    const intervals = ['1d','5d','1mo','3mo','6mo','1y','2y','5y','10y','ytd','max'];
    const labels = ['1 day','5 day','1 month','3 months','6 months','1 year','2 years','5 years','10 years','Year to date','All'];

    const [selectedOption, setSelectedOption] = useState(defaultOption);
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setOption(event.target.value);
    };

    return (
        <div className="period-container">
            <select className="select-container" value={selectedOption} onChange={handleSelectChange} size={labels.length}>
                {intervals.map(item => {
                    return (
                        <option value={item}>
                            {labels[intervals.indexOf(item)]}
                        </option>
                    )
                })}
            </select>   
        </div>
    )
}

export default PeriodOptions;