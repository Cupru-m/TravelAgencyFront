import React, { useState, useEffect } from 'react';
import TableRow from './TableRow';
import AddRowForm from './AddRowForm';
import { deleteRow, updateRow, dropTable, fetchTableRows } from '../api/api';
import './TableDisplay.css';
import { normalizeKeys } from "../utils/utils";
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

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

    const handleRowAdded = async () => {
        try {
            const updatedRowsRaw = await fetchTableRows(tableName);
            const updatedRows = updatedRowsRaw.map(normalizeKeys);
            setRows(updatedRows);
            setNotification({ message: 'Строка успешно добавлена', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Ошибка при обновлении таблицы после добавления строки:', error);
            setNotification({ message: 'Не удалось обновить таблицу', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleDropTable = async () => {
        if (window.confirm(`Вы уверены, что хотите удалить таблицу "${tableName}"?`)) {
            try {
                await dropTable(tableName);
                setNotification({ message: 'Таблица успешно удалена', type: 'success' });
                setTimeout(() => {
                    setNotification(null);
                    navigate('/');
                }, 2000);
            } catch (error) {
                console.error('Ошибка при удалении таблицы:', error);
                setNotification({ message: 'Не удалось удалить таблицу', type: 'error' });
                setTimeout(() => setNotification(null), 3000);
            }
        }
    };

    const handleExportToExcel = async () => {
        try {
            const tableData = {
                columns: columns.map(col => ({ name: col.name, type: col.type })),
                rows: rows.map(row => {
                    const rowData: any = {};
                    columns.forEach(col => {
                        rowData[col.name] = row[col.name] ?? 'NULL';
                    });
                    return rowData;
                })
            };

            const response = await fetch('/api/database/export-to-excel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tableData),
            });

            if (!response.ok) {
                throw new Error('Ошибка при экспорте: ' + response.status);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${tableName}_export.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setNotification({ message: 'Экспорт в Excel успешен', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Ошибка экспорта:', error);
            setNotification({ message: 'Не удалось экспортировать таблицу', type: 'error' });
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
            <div className="table-action-buttons">
                <button className="add-row-btn" onClick={() => setIsAddModalOpen(true)}>
                    Добавить строку
                </button>
                <button className="drop-table-btn" onClick={handleDropTable}>
                    Удалить таблицу
                </button>
                <button className="export-excel-btn" onClick={handleExportToExcel}>
                    Экспорт в Excel
                </button>
            </div>
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
                <AddRowForm
                    tableName={tableName}
                    columns={columns}
                    onClose={() => setIsAddModalOpen(false)}
                    onRowAdded={handleRowAdded}
                />
            )}
        </div>
    );
};

export default TableDisplay;