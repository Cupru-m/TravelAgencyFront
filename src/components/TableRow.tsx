// src/components/TableRow.tsx
import React, { useState, useEffect } from 'react';
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
    const [modifiedRow, setModifiedRow] = useState<any>({ ...row }); // Копия строки для отслеживания изменений

    // Обновляем modifiedRow при изменении исходной строки (например, при обновлении данных с сервера)
    useEffect(() => {
        setModifiedRow({ ...row });
    }, [row]);

    const handleDoubleClick = (columnName: string, value: string) => {
        setEditingCell(columnName);
        setEditValue(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    };

    const handleBlur = (columnName: string) => {
        const updatedRow = { ...modifiedRow, [columnName]: editValue };
        setModifiedRow(updatedRow); // Обновляем изменённую строку
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
        setIsSelected(!isSelected);
    };

    const handleUpdate = () => {
        onUpdate(modifiedRow); // Передаём изменённую строку в родительский компонент
        setIsSelected(false); // Скрываем кнопки после нажатия "Изменить"
    };

    return (
        <>
            <tr onClick={handleRowClick} className={isSelected ? 'selected-row' : ''}>
                {columns.map((column) => {
                    const rawValue = modifiedRow[column.name]; // Используем modifiedRow для отображения
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
                        <div className="action-buttons">
                            <button className="delete-btn">Удалить</button>
                            <button className="update-btn" onClick={handleUpdate}>
                                Изменить
                            </button>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableRow;