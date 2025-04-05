// src/components/OptionsList.tsx
import React, { useState, useEffect } from 'react';
import { fetchSqlOptions, SqlOption, executeSqlQuery, TableData } from '../api/api';
import './OptionsList.css';

interface OptionsListProps {
    onQueryExecute: (tableData: TableData) => void;
    tableName: string; // Добавляем tableName
}

const OptionsList: React.FC<OptionsListProps> = ({ onQueryExecute, tableName }) => {
    const [options, setOptions] = useState<SqlOption[]>([]);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const data = await fetchSqlOptions();
                setOptions(data);
            } catch (error) {
                console.error('Ошибка:', error);
                setOptions([]);
            }
        };

        loadOptions();
    }, []);

    const handleButtonClick = async (sqlQuery: string) => {
        try {
            const tableData = await executeSqlQuery(sqlQuery, tableName);
            onQueryExecute(tableData);
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    return (
        <div className="options-list">
            <h3>Операции</h3>
            {options.length > 0 ? (
                options.map((option, index) => (
                    <div key={index}>
                        <div className="option-button">
                            <button onClick={() => handleButtonClick(option.query)}>
                                {option.name}
                            </button>
                        </div>
                        {index < options.length - 1 && <hr className="option-divider" />}
                    </div>
                ))
            ) : (
                <p>Нет доступных операций</p>
            )}
        </div>
    );
};

export default OptionsList;