// src/pages/TableView.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TableDisplay from '../components/TableDisplay';
import SqlQueryInput from '../components/SqlQueryInput';
import { fetchTableColumns, fetchTableRows } from '../api/api';
import './TableView.css';

export interface ColumnInfo {
    name: string;
    type: string;
}

const toSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const normalizeKeys = (obj: any): any => {
    const newObj: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const snakeKey = toSnakeCase(key);
            newObj[snakeKey] = obj[key];
        }
    }
    return newObj;
};

const TableView: React.FC = () => {
    const { tableName } = useParams<{ tableName: string }>();
    const [columns, setColumns] = useState<ColumnInfo[]>([]);
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        const fetchColumnsAndRows = async () => {
            try {
                if (!tableName) {
                    throw new Error('Table name is not provided');
                }

                const columnsData = await fetchTableColumns(tableName);
                console.log(`Columns for ${tableName}:`, columnsData);
                setColumns(columnsData);

                const rowsData = await fetchTableRows(tableName);
                const normalizedRows = rowsData.map(normalizeKeys);
                console.log(`Normalized rows for ${tableName}:`, normalizedRows);
                setRows(normalizedRows);
            } catch (error) {
                console.error('Ошибка:', error);
                setColumns([]);
                setRows([]);
            }
        };

        fetchColumnsAndRows();
    }, [tableName]);

    return (
        <div className="table-view-wrapper">
            <div className="table-actions">
                <h3>Операции</h3>
                <button className="action-btn">Получить все строки</button>
                <button className="action-btn">Добавить строку</button>
            </div>
            <div className="table-content">
                <h2>{tableName || 'Название таблицы'}</h2>
                <TableDisplay rows={rows} columns={columns} />
                <SqlQueryInput />
            </div>
        </div>
    );
};

export default TableView;