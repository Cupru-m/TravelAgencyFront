import React, { useState, useEffect } from 'react';
import TableRow from './TableRow';
import { addRow, deleteRow, updateRow, fetchTableRows } from '../api/api'; // Убедись, что fetchTableRows импортирован
import './TableDisplay.css';
import {normalizeKeys, normalizeKeysToSnakeCase} from "../utils/utils";

interface ColumnInfo {
    name: string;
    type: string;
}

interface TableDisplayProps {
    rows: any[];
    columns: ColumnInfo[];
    tableName: string;
}

interface Notification {
    message: string;
    type: 'success' | 'error';
}

const TableDisplay: React.FC<TableDisplayProps> = ({ rows: initialRows, columns, tableName }) => {
    const [rows, setRows] = useState<any[]>(initialRows);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [newRow, setNewRow] = useState<{ [key: string]: string }>({}); // Явно типизируем newRow

    useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    const handleUpdateRow = async (updatedRow: any) => {
        try {
            await updateRow(tableName, updatedRow.id, updatedRow);
            const updatedRows = rows.map((row) => (row.id === updatedRow.id ? updatedRow : row));
            setRows(updatedRows);
            setNotification({ message: 'Операция произведена успешно', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Ошибка при обновлении строки:', error);
            setNotification({ message: 'Не удалось произвести операцию', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleDeleteRow = async (id: string) => {
        try {
            await deleteRow(tableName, id);
            const updatedRows = rows.filter((row) => row.id !== id);
            setRows(updatedRows);
            setNotification({ message: 'Строка успешно удалена', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Ошибка при удалении строки:', error);
            setNotification({ message: 'Не удалось удалить строку', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleAddRow = async () => {
        try {
            await addRow(tableName, newRow);
            const updatedRowsRaw = await fetchTableRows(tableName); // Получаем данные с сервера
            const updatedRows = updatedRowsRaw.map(normalizeKeys);
            setRows(updatedRows);
            setIsAddModalOpen(false);
            setNewRow({});
            setNotification({ message: 'Строка успешно добавлена', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Ошибка при добавлении строки:', error);
            setNotification({ message: 'Не удалось добавить строку', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleInputChange = (columnName: string, value: string) => {
        setNewRow((prev: { [key: string]: string }) => ({ ...prev, [columnName]: value }));
    };

    return (
        <div className="table-display-container">
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <button className="add-row-btn" onClick={() => setIsAddModalOpen(true)}>
                Добавить строку
            </button>
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

            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Добавление новой строки</h4>
                        {columns.map((column) => (
                            <div key={column.name} className="modal-field">
                                <label>{column.name} ({column.type}):</label>
                                <input
                                    type="text"
                                    value={newRow[column.name] || ''}
                                    onChange={(e) => handleInputChange(column.name, e.target.value)}
                                    placeholder={`Введите ${column.name}`}
                                />
                            </div>
                        ))}
                        <div className="modal-buttons">
                            <button className="modal-save-btn" onClick={handleAddRow}>
                                Сохранить
                            </button>
                            <button
                                className="modal-cancel-btn"
                                onClick={() => setIsAddModalOpen(false)}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableDisplay;