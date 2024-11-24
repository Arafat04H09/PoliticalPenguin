import '../Styles/Home.css';
import USMap from '../Components/Maps/USMap';
import React, {useState, useEffect} from 'react';
import Header from '../Components/Header/Header';

const Home = () => {
    const [hello, setHello] = useState("");
    const [USMapJson, setUSMapJson] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/3_states_outline.geojson`);
            const data = await response.json();
            setUSMapJson(data)
        } catch (error) {
            console.error('Error fetching GeoJSON data: ', error);
        }
    };

    useEffect(() => {
        fetchData();
      }, [Home]);

    return (
        <div className="content">
            <Header />
            <div className='map-content'>  
                { <USMap plan={USMapJson}/> }
            </div>
        </div>
    );
}

export default Home;
