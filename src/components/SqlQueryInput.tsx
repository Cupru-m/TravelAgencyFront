import React, { useState } from 'react';
import { saveSqlTemplate } from '../api/api';
import './SqlQueryInput.css';

interface Notification {
    message: string;
    type: 'success' | 'error';
}

interface SqlQueryInputProps {
    onTemplateSaved: () => void; // Новый пропс для уведомления о сохранении
}

const SqlQueryInput: React.FC<SqlQueryInputProps> = ({ onTemplateSaved }) => {
    const [query, setQuery] = useState<string>(''); // Состояние для SQL-запроса
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Состояние для модального окна
    const [templateName, setTemplateName] = useState<string>(''); // Состояние для названия шаблона
    const [error, setError] = useState<string>(''); // Состояние для ошибок в модальном окне
    const [notification, setNotification] = useState<Notification | null>(null); // Состояние для уведомлений

    const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(e.target.value);
    };

    const handleAddTemplate = () => {
        if (!query.trim()) {
            setError('SQL-запрос не может быть пустым');
            return;
        }
        setError('');
        setIsModalOpen(true); // Открываем модальное окно
    };

    const handleSaveTemplate = async () => {
        if (!templateName.trim()) {
            setError('Название шаблона не может быть пустым');
            return;
        }

        try {
            await saveSqlTemplate({ name: templateName, query });
            setQuery(''); // Очищаем поле ввода
            setTemplateName(''); // Очищаем название
            setIsModalOpen(false); // Закрываем модальное окно
            setError('');
            setNotification({ message: 'Шаблон успешно сохранён', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
            onTemplateSaved(); // Уведомляем родительский компонент
        } catch (err) {
            setError('');
            setIsModalOpen(false); // Закрываем модальное окно даже при ошибке
            setNotification({ message: 'Ошибка при сохранении шаблона', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
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
                <button className="sql-execute-btn">Выполнить запрос</button>
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