// src/components/AddRowForm.tsx
import React, { useState } from 'react';
import './AddRowForm.css';

interface ColumnInfo {
    name: string;
    type: string;
}

interface AddRowFormProps {
    tableName: string;
    columns: ColumnInfo[];
    onClose: () => void;
    onRowAdded: () => void; // Callback для обновления таблицы после добавления строки
}

const AddRowForm: React.FC<AddRowFormProps> = ({ tableName, columns, onClose, onRowAdded }) => {
    const [newRow, setNewRow] = useState<{ [key: string]: string }>(
        columns.reduce((acc, col) => ({ ...acc, [col.name]: '' }), {})
    );

    const handleInputChange = (columnName: string, value: string) => {
        setNewRow((prev) => ({ ...prev, [columnName]: value }));
    };

    const handleAddRow = async () => {
        try {
            const response = await fetch(`/api/tables/${tableName}/rows`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRow),
            });
            if (!response.ok) {
                throw new Error('Failed to add row');
            }
            await response.json(); // Ожидаем JSON-ответ от бэкенда
            setNewRow(columns.reduce((acc, col) => ({ ...acc, [col.name]: '' }), {})); // Сбрасываем форму
            onRowAdded(); // Уведомляем родительский компонент
            onClose(); // Закрываем модальное окно
        } catch (error) {
            console.error('Ошибка при добавлении строки:', error);
            alert('Не удалось добавить строку');
        }
    };

    return (
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
                    <button className="modal-cancel-btn" onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRowForm;