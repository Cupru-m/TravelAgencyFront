// src/components/ListView.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ListView.css';

interface ListViewProps {
    items: string[];
}

const ListView: React.FC<ListViewProps> = ({ items }) => {
    const navigate = useNavigate();

    const handleItemClick = (tableName: string) => {
        navigate(`/table-view/${tableName}`);
    };

    return (
        <div className="list-view-container">
            <ul className="list-view">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className="list-item"
                        onClick={() => handleItemClick(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListView;