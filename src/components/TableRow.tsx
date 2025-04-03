// src/components/TableRow.tsx
import React, { useState } from 'react';
import './TableRow.css';

interface TableRowProps {
    row: any;
    columns: { name: string; type: string }[];
    onUpdate: (updatedRow: any) => void;
}

const TableRow: React.FC<TableRowProps> = ({ row, columns, onUpdate }) => {
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const handleDoubleClick = (columnName: string, value: string) => {
        setEditingCell(columnName);
        setEditValue(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    };

    const handleBlur = (columnName: string) => {
        const updatedRow = { ...row, [columnName]: editValue };
        onUpdate(updatedRow);
        setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, columnName: string) => {
        if (e.key === 'Enter') {
            handleBlur(columnName);
        }
    };

    const formatValue = (value: any): string => {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return value.toString();
    };

    const handleRowClick = () => {
        setIsSelected(!isSelected); // Переключаем состояние выбора
    };

    return (
        <>
            <tr onClick={handleRowClick} className={isSelected ? 'selected-row' : ''}>
                {columns.map((column) => {
                    const rawValue = row[column.name];
                    const value = formatValue(rawValue);
                    return (
                        <td key={column.name}>
                            {editingCell === column.name ? (
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur(column.name)}
                                    onKeyDown={(e) => handleKeyDown(e, column.name)}
                                    autoFocus
                                    className="edit-input"
                                />
                            ) : (
                                <div
                                    className="cell-content"
                                    onDoubleClick={() => handleDoubleClick(column.name, value)}
                                >
                                    {value}
                                </div>
                            )}
                        </td>
                    );
                })}
            </tr>
            {isSelected && (
                <tr className="delete-row">
                    <td colSpan={columns.length}>
                        <button className="delete-btn">Удалить</button>
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableRow;