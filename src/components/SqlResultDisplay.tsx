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
    return (
        <div className="table-display-container">
            <h2>Результат SQL запроса</h2>
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