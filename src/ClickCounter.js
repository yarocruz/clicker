import React, { useState, useEffect } from 'react';
import {getData, updateClicks} from "./firebase";

function ClickCounter() {
    const [count, setCount] = useState(null);
    const [country, setCountry] = useState(null);
    const [city, setCity] = useState(null);
    const [data, setData] = useState(null);
    const [location, setLocation] = useState(false);

    console.log(country, city)

    useEffect(() => {
        const fetchData = async () => {
            // only fetch the data once
            const response = await getData();
            setData(response);
            console.log(response);
            setCount(response.reduce((acc, cur) => acc + cur.clicks, 0));
            setCountry(response[0].name)
        };
        fetchData();
    }, []);

    useEffect(() => {
        const successfulLookup = position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=0d0ed8aa77ff49c89e3f18256b62b31a`)
                .then(response => response.json())
                .then(data => {
                    //console.log(data.results[0].components) // {city: "San Francisco", state: "California", country: "United States"}
                    setCountry(data.results[0].components.country);
                    setCity(data.results[0].components.city);
                });
        };

        if (window.navigator && window.navigator.geolocation && location && !country && !city) {
            window.navigator.geolocation
                .getCurrentPosition(successfulLookup, (err) => console.log(err));
            setLocation(true)
            console.log('We should only see this once.');
        } else {
            setLocation(false)
        }

    }, [location, city, country]);

    const handleClick = () => {
        updateClicks('United States', 'Orlando').then((response) => {
            console.log(response);
            setData(response);
            setCount(count + 1);

        })

    }

    return (
        <div>
            <button onClick={handleClick}>Click me!</button>
            <p>Click count: {count}</p>

            <table id="click-data">
                <thead>
                <tr>
                    <th>Country</th>
                    <th>City</th>
                    <th>Number of clicks</th>
                </tr>
                </thead>
                <tbody>
                {data && data.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.city}</td>
                            <td>{item.clicks}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    );
}

export default ClickCounter;
