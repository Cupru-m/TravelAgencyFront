// src/components/TableDisplay.tsx
import React from 'react';
import TableRow from './TableRow';
import './TableDisplay.css';

interface ColumnInfo {
    name: string;
    type: string;
}

interface TableDisplayProps {
    rows: any[];
    columns: ColumnInfo[];
    tableName:any;
}

const TableDisplay: React.FC<TableDisplayProps> = ({ rows, columns }) => {
    const handleUpdateRow = (updatedRow: any) => {
        // Здесь можно добавить запрос на сервер для обновления строки
        console.log('Updated row:', updatedRow);
        // Для примера просто логируем, в реальном приложении нужно обновить состояние
    };

    return (
        <div className="table-display-container">
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
                            key={rowIndex}
                            row={row}
                            columns={columns}
                            onUpdate={handleUpdateRow}
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