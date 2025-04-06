// src/components/SqlQueryInput.tsx
import React, { useState } from 'react';
import { saveSqlTemplate, executeSqlQuerySimple } from '../api/api';
import './SqlQueryInput.css';

interface Notification {
    message: string;
    type: 'success' | 'error';
}

interface SqlQueryInputProps {
    onTemplateSaved: () => void;
    onQueryResult: (result: { columns: { name: string; type: string }[]; rows: any[] }) => void;
    onShowResult: (show: boolean) => void;
}

const SqlQueryInput: React.FC<SqlQueryInputProps> = ({ onTemplateSaved, onQueryResult, onShowResult }) => {
    const [query, setQuery] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [templateName, setTemplateName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [notification, setNotification] = useState<Notification | null>(null);

    const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(e.target.value);
        setError('');
    };

    const handleAddTemplate = () => {
        if (!query.trim()) {
            setError('SQL-запрос не может быть пустым');
            return;
        }
        setError('');
        setIsModalOpen(true);
    };

    const handleSaveTemplate = async () => {
        if (!templateName.trim()) {
            setError('Название шаблона не может быть пустым');
            return;
        }

        try {
            await saveSqlTemplate({ name: templateName, query });
            setQuery('');
            setTemplateName('');
            setIsModalOpen(false);
            setError('');
            setNotification({ message: 'Шаблон успешно сохранён', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
            onTemplateSaved();
        } catch (err) {
            setError('');
            setIsModalOpen(false);
            setNotification({ message: 'Ошибка при сохранении шаблона', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleExecuteQuery = async () => {
        if (!query.trim()) {
            setError('SQL-запрос не может быть пустым');
            return;
        }

        try {
            const result = await executeSqlQuerySimple(query);
            onQueryResult(result);
            onShowResult(true);
            setError('');
            setNotification({ message: 'Запрос успешно выполнен', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            console.error('Ошибка при выполнении SQL-запроса:', err);
            setError('Не удалось выполнить SQL-запрос');
            setNotification({ message: 'Ошибка при выполнении запроса', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            onShowResult(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTemplateName('');
        setError('');
    };

    return (
        <div className="sql-query-container">
            <h3 className="sql-query-title">Введите SQL-запрос</h3>
            <textarea
                className="sql-query-input"
                placeholder="SELECT * FROM table_name WHERE condition;"
                value={query}
                onChange={handleQueryChange}
            />
            {error && !isModalOpen && <div className="error-message">{error}</div>}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <div className="sql-query-buttons">
                <button className="sql-template-btn" onClick={handleAddTemplate}>
                    Добавить SQL шаблон
                </button>
                <button className="sql-execute-btn" onClick={handleExecuteQuery}>
                    Выполнить запрос
                </button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Добавьте название шаблона</h4>
                        <input
                            type="text"
                            className="modal-input"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Название шаблона"
                        />
                        {error && <div className="error-message">{error}</div>}
                        <div className="modal-buttons">
                            <button className="modal-save-btn" onClick={handleSaveTemplate}>
                                Сохранить
                            </button>
                            <button className="modal-cancel-btn" onClick={handleCloseModal}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SqlQueryInput;