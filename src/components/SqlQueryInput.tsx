// src/components/SqlQueryInput.tsx
import React from 'react';
import './SqlQueryInput.css';

const SqlQueryInput: React.FC<{}> = () => {
    return (
        <div className="sql-query-container">
            <h3 className="sql-query-title">Введите SQL-запрос</h3>
            <textarea
                className="sql-query-input"
                placeholder="SELECT * FROM table_name WHERE condition;"
            />
            <div className="sql-query-buttons">
                <button className="sql-template-btn">Добавить шаблон SQL-запроса</button>
                <button className="sql-execute-btn">Выполнить запрос</button>
            </div>
        </div>
    );
};

export default SqlQueryInput;