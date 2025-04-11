// src/components/AddTableForm.tsx
import React, { useState } from 'react';
import { createTable } from '../api/api';
import './AddTableForm.css';

// Сокращённый список типов данных PostgreSQL (без BOOLEAN)
const postgresDataTypes = [
    'INTEGER', 'BIGINT', 'SERIAL', 'VARCHAR', 'TEXT', 'DATE', 'TIMESTAMP'
];

interface AddTableFormProps {
    onClose: () => void;
    onTableCreated: () => void;
}

interface Notification {
    message: string;
    type: 'success' | 'error';
}

// Расширяем интерфейс столбца, добавляя свойство isPrimaryKey
interface ColumnDefinition {
    name: string;
    type: string;
    isPrimaryKey: boolean;
}

const AddTableForm: React.FC<AddTableFormProps> = ({ onClose, onTableCreated }) => {
    const [newTableName, setNewTableName] = useState<string>('');
    const [newColumns, setNewColumns] = useState<ColumnDefinition[]>([{ name: '', type: 'INTEGER', isPrimaryKey: false }]);
    const [notification, setNotification] = useState<Notification | null>(null);

    const handleAddColumn = () => {
        setNewColumns([...newColumns, { name: '', type: 'INTEGER', isPrimaryKey: false }]);
    };

    const handleColumnChange = (index: number, field: 'name' | 'type' | 'isPrimaryKey', value: string | boolean) => {
        const updatedColumns = newColumns.map((col, i) =>
            i === index ? { ...col, [field]: value } : col
        );
        // Если отмечаем столбец как Primary Key, снимаем эту отметку с других столбцов
        if (field === 'isPrimaryKey' && value === true) {
            updatedColumns.forEach((col, i) => {
                if (i !== index) col.isPrimaryKey = false;
            });
        }
        setNewColumns(updatedColumns);
    };

    const handleCreateTable = async () => {
        if (!newTableName.trim()) {
            setNotification({ message: 'Название таблицы не может быть пустым', type: 'error' });
            return;
        }
        if (newColumns.some(col => !col.name.trim())) {
            setNotification({ message: 'Все имена столбцов должны быть заполнены', type: 'error' });
            return;
        }

        try {
            // Передаем данные в API, включая информацию о Primary Key
            await createTable(newTableName, newColumns);
            setNewTableName('');
            setNewColumns([{ name: '', type: 'INTEGER', isPrimaryKey: false }]);
            setNotification({ message: 'Таблица успешно создана', type: 'success' });
            setTimeout(() => {
                setNotification(null);
                onTableCreated();
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Ошибка при создании таблицы:', error);
            setNotification({ message: 'Не удалось создать таблицу', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Создание новой таблицы</h4>
                {notification && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}
                <div className="modal-field">
                    <label>Название таблицы:</label>
                    <input
                        type="text"
                        value={newTableName}
                        onChange={(e) => setNewTableName(e.target.value)}
                        placeholder="Введите название таблицы"
                    />
                </div>
                {newColumns.map((column, index) => (
                    <div key={index} className="modal-field">
                        <label>Столбец {index + 1}:</label>
                        <div className="column-inputs">
                            <input
                                type="text"
                                value={column.name}
                                onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                                placeholder="Название столбца"
                            />
                            <select
                                value={column.type}
                                onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
                            >
                                {postgresDataTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <label className="primary-key-label">
                                <input
                                    type="checkbox"
                                    checked={column.isPrimaryKey}
                                    onChange={(e) => handleColumnChange(index, 'isPrimaryKey', e.target.checked)}
                                />
                                Primary Key
                            </label>
                        </div>
                    </div>
                ))}
                <button onClick={handleAddColumn}>Добавить столбец</button>
                <div className="modal-buttons">
                    <button className="modal-save-btn" onClick={handleCreateTable}>
                        Создать
                    </button>
                    <button className="modal-cancel-btn" onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTableForm;