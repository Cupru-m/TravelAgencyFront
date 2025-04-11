// components/tableView.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TableDisplay from '../components/TableDisplay';
import SqlResultDisplay from '../components/SqlResultDisplay';
import SqlQueryInput from '../components/SqlQueryInput';
import OptionsList from '../components/OptionsList';
import { fetchTableColumns, fetchTableRows, TableData } from '../api/api';
import './TableView.css';

export interface ColumnInfo {
    name: string;
    type: string;
}

interface Notification {
    message: string;
    type: 'success' | 'error';
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
    const { tableName: initialTableName } = useParams<{ tableName: string }>();
    const [tableName, setTableName] = useState<string>(initialTableName || '');
    const [columns, setColumns] = useState<ColumnInfo[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [refreshTemplates, setRefreshTemplates] = useState<number>(0);
    const [sqlResult, setSqlResult] = useState<TableData | null>(null);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [showSqlResult, setShowSqlResult] = useState<boolean>(false);

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
            setSqlResult(null);
            setNotification(null);
        } catch (error) {
            console.error('Ошибка:', error);
            setColumns([]);
            setRows([]);
        }
    };

    useEffect(() => {
        fetchTableData(tableName);
    }, [tableName]);

    const handleQueryExecute = (tableData: TableData & { error?: string }) => {
        if (tableData.error) {
            setNotification({ message: tableData.error, type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        } else {
            setSqlResult(tableData);
            setNotification({ message: 'Запрос успешно выполнен', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleTableSelect = (selectedTableName: string) => {
        setTableName(selectedTableName);
    };

    const handleTemplateSaved = () => {
        setRefreshTemplates((prev) => prev + 1);
    };

    const handleShowSqlResult = (show: boolean) => {
        setShowSqlResult(show);
    };

    return (
        <div className="table-view-wrapper">
            <OptionsList
                onQueryExecute={handleQueryExecute}
                tableName={tableName}
                onTableSelect={handleTableSelect}
                refreshTemplates={refreshTemplates}
            />
            <div className="table-content">
                <h2>{tableName || 'Название таблицы'}</h2>
                {sqlResult ? (
                    <SqlResultDisplay
                        rows={sqlResult.rows}
                        columns={sqlResult.columns}
                        notification={notification}
                    />
                ) : (
                    <TableDisplay rows={rows} columns={columns} tableName={tableName} />
                )}
                <SqlQueryInput
                    onTemplateSaved={handleTemplateSaved}
                    onQueryResult={handleQueryExecute}
                    onShowResult={handleShowSqlResult}
                />
            </div>
        </div>
    );
};

export default TableView;