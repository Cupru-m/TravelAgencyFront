// src/components/TableDisplay.tsx
import React, { useState } from 'react';
import TableRow from './TableRow';
import './TableDisplay.css';
import {deleteRow, updateRow} from "../api/api";

interface ColumnInfo {
    name: string;
    type: string;
}

interface TableDisplayProps {
    rows: any[];
    columns: ColumnInfo[];
    tableName: any; // Исправляем тип tableName на string
}

interface Notification {
    message: string;
    type: 'success' | 'error';
}

const TableDisplay: React.FC<TableDisplayProps> = ({ rows: initialRows, columns, tableName }) => {
    const [rows, setRows] = useState<any[]>(initialRows);
    const [notification, setNotification] = useState<Notification | null>(null);

    // Обновляем состояние строк, если изменились входные данные (например, после выполнения SQL-запроса)
    React.useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    const handleUpdateRow = async (updatedRow: any) => {
        try {
            await updateRow(tableName, updatedRow.id, updatedRow);

            // Обновляем локальное состояние строк
            const updatedRows = rows.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            );
            setRows(updatedRows);
            setNotification({ message: 'Операция произведена успешно', type: 'success' });

            // Убираем уведомление через 3 секунды
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Ошибка при обновлении строки:', error);
            setNotification({ message: 'Не удалось произвести операцию', type: 'error' });

            // Убираем уведомление через 3 секунды
            setTimeout(() => setNotification(null), 3000);
        }
    };
    React.useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);
    const handleDeleteRow = async (id: string) => {
        try {
            await deleteRow(tableName, id);

            // Удаляем строку из локального состояния
            const updatedRows = rows.filter((row) => row.id !== id);
            setRows(updatedRows);
            setNotification({ message: 'Строка успешно удалена', type: 'success' });

            // Убираем уведомление через 3 секунды
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Ошибка при удалении строки:', error);
            setNotification({ message: 'Не удалось удалить строку', type: 'error' });

            // Убираем уведомление через 3 секунды
            setTimeout(() => setNotification(null), 3000);
        }
    };
    return (
        <div className="table-display-container">
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <table className="table-display">
                <thead>
                <tr>
                    {columns.length > 0 ? (
                        columns.map((column, index) => (
                            <th key={index}>
                                {column.name} ({column.type})
                            </th>
                        ))
                    ) : (
                        <th>Нет данных</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {rows.length > 0 ? (
                    rows.map((row, rowIndex) => (
                        <TableRow
                            key={row.id || rowIndex}
                            row={row}
                            columns={columns}
                            onUpdate={handleUpdateRow}
                            onDelete={handleDeleteRow}
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length || 1}>Нет строк для отображения</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TableDisplay;