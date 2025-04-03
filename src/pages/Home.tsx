// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import ListView from '../components/ListView';
import { fetchDatabaseInfo } from '../api/api'; // Импортируем функцию
import './Home.css';

const Home: React.FC = () => {
    const [DBname, setDBname] = useState<string | null>(null);
    const [tableList, setTableList] = useState<string[]>([]);

    useEffect(() => {
        const loadDatabaseInfo = async () => {
            try {
                const data = await fetchDatabaseInfo();
                setDBname(data.dbName);
                setTableList(data.tables);
            } catch (error) {
                console.error('Ошибка:', error);
                setDBname('<Название базы данных>');
                setTableList([]);
            }
        };

        loadDatabaseInfo();
    }, []);

    return (
        <div className="home-container">
            <h1>{DBname || 'Загрузка...'}</h1>
            <h2>Список таблиц</h2>
            <ListView items={tableList} />
        </div>
    );
};

export default Home;