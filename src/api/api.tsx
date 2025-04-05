// src/api.ts
interface ColumnInfo {
    name: string;
    type: string;
}

interface DatabaseInfo {
    dbName: string;
    tables: string[];
}
export interface SqlOption {
    name: string;
    query: string;
}
export interface TableData {
    columns: ColumnInfo[];
    rows: any[];
}

// Базовый URL для API (можно изменить, если бэкенд работает на другом домене/порту)
const BASE_URL = '';

// Получение информации о базе данных (название и список таблиц)
export const fetchDatabaseInfo = async (): Promise<DatabaseInfo> => {
    const response = await fetch(`${BASE_URL}/api/database-info`);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке информации о базе данных');
    }
    return response.json();
};

// Получение столбцов для указанной таблицы
export const fetchTableColumns = async (tableName: string): Promise<ColumnInfo[]> => {
    const response = await fetch(`${BASE_URL}/api/${tableName.toLowerCase()}/columns`);
    if (!response.ok) {
        throw new Error(`Ошибка при загрузке столбцов для таблицы ${tableName}`);
    }
    return response.json();
};

// Получение строк для указанной таблицы
export const fetchTableRows = async (tableName: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/${tableName.toLowerCase()}`); // Например, /api/clients, /api/bookings
    if (!response.ok) {
        throw new Error(`Ошибка при загрузке строк для таблицы ${tableName}`);
    }
    return response.json();
};
export const fetchSqlOptions = async (): Promise<SqlOption[]> => {
    const response = await fetch('/api/sql-options');
    if (!response.ok) {
        throw new Error('Ошибка при загрузке SQL-запросов');
    }
    return response.json();
};
// Новая функция для выполнения SQL-запроса
export const executeSqlQuery = async (sqlQuery: string, tableName: string): Promise<TableData> => {
    const response = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery, tableName }),
    });

    if (!response.ok) {
        throw new Error('Ошибка при выполнении SQL-запроса');
    }

    return response.json();
};