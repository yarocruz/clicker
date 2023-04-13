import React, { useState, useEffect } from 'react';
import {getData, updateClicks} from "./firebase";

function ClickCounter() {
    const [count, setCount] = useState(null);
    const [country, setCountry] = useState(null);
    const [city, setCity] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const successfulLookup = position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=0d0ed8aa77ff49c89e3f18256b62b31a`)
                .then(response => response.json())
                .then(data => {
                    setCountry(data.results[0].components.country);
                    setCity(data.results[0].components.city);
                });
        };

        // i have to wait a day to try this again and double check that it works as intended which is to only run this once
        if (window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation
                .getCurrentPosition(successfulLookup, (err) => console.log(err));
            console.log('we should only see this once')
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // only fetch the data once
            const response = await getData();
            setData(response);
            setCount(response.reduce((acc, cur) => acc + cur.clicks, 0));
            setCountry(response[0].name)
            setCity(response[0].city)
        };
        fetchData();
    }, []);

    const handleClick = () => {
        updateClicks(country, city).then((response) => {
            setData(response);
            setCount(count + 1);
        })
    }

    return (
        <div>
            <button onClick={handleClick}>Click me!</button>
            <p>Total Click Count: {count}</p>

            <table id="click-data">
                <thead>
                <tr>
                    <th>Country</th>
                    <th>City</th>
                    <th>Number of clicks</th>
                </tr>
                </thead>
                <tbody>
                {data && data.sort((a, b) => b.clicks - a.clicks).map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.city}</td>
                        <td>{item.clicks}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClickCounter;
