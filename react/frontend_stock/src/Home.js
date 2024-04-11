import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [data, setData] = useState('');
    useEffect(() => {
      axios.get('http://localhost:8000/stock/')
        .then(response => {
          setData(response.data)
        })
        .catch(error => {
          console.log(error);
        });
    }, []);

  return (
    <div>
      <h1>Hello, World!</h1>
      {data.period}
    </div>
  );
}

export default Home;