// components/OptionsList.tsx
import React, { useState, useEffect, useRef } from 'react';
import { executeSqlTemplate, fetchDatabaseInfo, fetchSqlTemplates, SqlTemplate, TableData, backupDatabase, restoreDatabase } from '../api/api';
import AddTableForm from './AddTableForm';
import './OptionsList.css';

interface OptionsListProps {
    onQueryExecute: (tableData: TableData) => void;
    tableName: string;
    onTableSelect: (tableName: string) => void;
    refreshTemplates: number;
}

interface TreeItem {
    name: string;
    children?: string[];
}

const OptionsList: React.FC<OptionsListProps> = ({ tableName, onQueryExecute, onTableSelect, refreshTemplates }) => {
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
        tables: false,
        sqlTemplates: false,
    });
    const [treeData, setTreeData] = useState<TreeItem[]>([
        { name: 'Таблицы', children: [] },
        { name: 'SQL шаблоны', children: [] },
    ]);
    const [width, setWidth] = useState<number>(15);
    const [isAddTableModalOpen, setIsAddTableModalOpen] = useState<boolean>(false);
    const optionsListRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef<boolean>(false);

    const loadData = async () => {
        try {
            const dbInfo = await fetchDatabaseInfo();
            const tables = dbInfo.tables;
            const sqlTemplates = await fetchSqlTemplates();
            const templateNames = sqlTemplates.map((template: SqlTemplate) => template.name);

            setTreeData([
                { name: 'Таблицы', children: tables },
                { name: 'SQL шаблоны', children: templateNames },
            ]);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setTreeData([
                { name: 'Таблицы', children: [] },
                { name: 'SQL шаблоны', children: [] },
            ]);
        }
    };

    useEffect(() => {
        loadData();
    }, [refreshTemplates]);

    const startResizing = (e: React.MouseEvent<HTMLDivElement>) => {
        isResizing.current = true;
        e.preventDefault();
    };

    const stopResizing = () => {
        isResizing.current = false;
    };

    const resize = (e: MouseEvent) => {
        if (isResizing.current && optionsListRef.current) {
            const newWidthPx = e.clientX - optionsListRef.current.getBoundingClientRect().left;
            const newWidthVw = (newWidthPx / window.innerWidth) * 100;
            if (newWidthVw >= 10 && newWidthVw <= 30) {
                setWidth(newWidthVw);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, []);

    const toggleItem = (itemName: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [itemName.toLowerCase()]: !prev[itemName.toLowerCase()],
        }));
    };

    const handleItemClick = async (child: string, parent: string) => {
        if (parent === 'Таблицы') {
            onTableSelect(child);
        } else if (parent === 'SQL шаблоны') {
            try {
                const tableData = await executeSqlTemplate(child, tableName);
                onQueryExecute(tableData);
            } catch (error) {
                console.error('Ошибка при выполнении SQL-шаблона:', error);
            }
        }
    };

    const handleAddTableClick = () => {
        setIsAddTableModalOpen(true);
    };

    const handleBackupDatabase = async () => {
        try {
            await backupDatabase();
            alert('Резервная копия успешно создана');
            loadData();
        } catch (error) {
            console.error('Ошибка при создании резервной копии:', error);
            alert('Не удалось создать резервную копию');
        }
    };

    const handleRestoreDatabase = async () => {
        if (window.confirm('Вы уверены, что хотите восстановить базу данных из резервной копии? Это перезапишет текущие данные.')) {
            try {
                await restoreDatabase();
                alert('База данных успешно восстановлена');
                loadData();
                onTableSelect('');
            } catch (error) {
                console.error('Ошибка при восстановлении базы данных:', error);
                alert('Не удалось восстановить базу данных');
            }
        }
    };

    const handleTableCreated = () => {
        loadData();
    };

    return (
        <div className="options-list" ref={optionsListRef} style={{ width: `${width}vw` }}>
            <h3>Операции</h3>
            <ul className="tree-view">
                {treeData.map((item) => (
                    <li key={item.name} className="tree-item">
                        <div className="tree-item-header" onClick={() => toggleItem(item.name)}>
                            <span className="tree-toggle">
                                {expandedItems[item.name.toLowerCase()] ? '▼' : '▶'}
                            </span>
                            {item.name}
                        </div>
                        {expandedItems[item.name.toLowerCase()] && item.children && (
                            <ul className="tree-children">
                                {item.children.length > 0 ? (
                                    item.children.map((child) => (
                                        <li
                                            key={child}
                                            className={`tree-child-item ${child === tableName && item.name === 'Таблицы' ? 'selected' : ''}`}
                                            onClick={() => handleItemClick(child, item.name)}
                                        >
                                            {child}
                                        </li>
                                    ))
                                ) : (
                                    <li className="tree-child-item">Нет данных</li>
                                )}
                                {item.name === 'Таблицы' && (
                                    <li className="tree-item">
                                        <button
                                            className="tree-item-header add-table-btn"
                                            onClick={handleAddTableClick}
                                        >
                                            Добавить таблицу
                                        </button>
                                    </li>
                                )}
                            </ul>
                        )}
                    </li>
                ))}
                <li className="tree-item">
                    <button className="tree-item-header" onClick={handleBackupDatabase}>
                        Сделать бэкап
                    </button>
                </li>
                <li className="tree-item">
                    <button className="tree-item-header" onClick={handleRestoreDatabase}>
                        Загрузить бэкап
                    </button>
                </li>
            </ul>
            <div className="resize-handle" onMouseDown={startResizing} />
            {isAddTableModalOpen && (
                <AddTableForm
                    onClose={() => setIsAddTableModalOpen(false)}
                    onTableCreated={handleTableCreated}
                />
            )}
        </div>
    );
};

export default OptionsList;