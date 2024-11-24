import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import './App.css';
import Home from "./Pages/Home";
import Header from "./Components/Header/Header";
import StatePage from "./Pages/StatePage"; 

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/statemap/:stateName' element={<StatePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
