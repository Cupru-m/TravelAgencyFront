import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TableDisplay from '../components/TableDisplay';
import SqlQueryInput from '../components/SqlQueryInput';
import OptionsList from '../components/OptionsList';
import { fetchTableColumns, fetchTableRows, TableData } from '../api/api';
import './TableView.css';
import {normalizeKeys} from "../utils/utils";

export interface ColumnInfo {
    name: string;
    type: string;
}

const toSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};



const TableView: React.FC = () => {
    const { tableName: initialTableName } = useParams<{ tableName: string }>();
    const [tableName, setTableName] = useState<string>(initialTableName || '');
    const [columns, setColumns] = useState<ColumnInfo[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [refreshTemplates, setRefreshTemplates] = useState<number>(0); // Счётчик для перезагрузки шаблонов

    const fetchTableData = async (name: string) => {
        try {
            if (!name) {
                throw new Error('Table name is not provided');
            }

            const columnsData = await fetchTableColumns(name);
            setColumns(columnsData);

            const rowsData = await fetchTableRows(name);
            const normalizedRows = rowsData.map(normalizeKeys);
            setRows(normalizedRows);
        } catch (error) {
            console.error('Ошибка:', error);
            setColumns([]);
            setRows([]);
        }
    };

    useEffect(() => {
        fetchTableData(tableName);
    }, [tableName]);

    const handleQueryExecute = (tableData: TableData) => {
        setColumns(tableData.columns);
        setRows(tableData.rows.map(normalizeKeys));
    };

    const handleTableSelect = (selectedTableName: string) => {
        setTableName(selectedTableName);
    };

    const handleTemplateSaved = () => {
        setRefreshTemplates((prev) => prev + 1); // Увеличиваем счётчик для перезагрузки шаблонов
    };

    return (
        <div className="table-view-wrapper">
            <OptionsList
                onQueryExecute={handleQueryExecute}
                tableName={tableName}
                onTableSelect={handleTableSelect}
                refreshTemplates={refreshTemplates} // Передаём счётчик для перезагрузки
            />
            <div className="table-content">
                <h2>{tableName || 'Название таблицы'}</h2>
                <TableDisplay rows={rows} columns={columns} tableName={tableName} />
                <SqlQueryInput onTemplateSaved={handleTemplateSaved} /> {/* Передаём callback */}
            </div>
        </div>
    );
};

export default TableView;