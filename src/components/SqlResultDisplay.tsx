import React from 'react';
import './SqlResultDisplay.css';

interface ColumnInfo {
    name: string;
    type: string;
}

interface Notification {
    message: string;
    type: 'success' | 'error';
}

interface SqlResultDisplayProps {
    rows: any[];
    columns: ColumnInfo[];
    notification: Notification | null;
}

const SqlResultDisplay: React.FC<SqlResultDisplayProps> = ({ rows, columns, notification }) => {
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
            a.download = 'sql_result_export.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка экспорта:', error);
            alert('Не удалось экспортировать таблицу');
        }
    };

    return (
        <div className="table-display-container">
            <h2>Результат SQL запроса</h2>
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <div className="table-action-buttons">
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
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>{row[column.name] ?? 'NULL'}</td>
                            ))}
                        </tr>
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

export default SqlResultDisplay;