// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TableView from './pages/TableView';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/table-view/:tableName" element={<TableView />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;