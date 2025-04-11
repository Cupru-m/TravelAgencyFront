import { normalizeKeysToCamelCase } from "../utils/utils";

interface ColumnInfo {
    name: string;
    type: string;
}

interface DatabaseInfo {
    dbName: string;
    tables: string[];
}

export interface SqlTemplate {
    name: string;
    query: string;
}

export interface TableData {
    columns: ColumnInfo[];
    rows: any[];
}

const BASE_URL = '';

export const executeSqlTemplate = async (templateName: string, tableName: string): Promise<TableData> => {
    const response = await fetch('/api/database/execute-sql-template', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateName, tableName }),
    });

    if (!response.ok) {
        throw new Error('Ошибка при выполнении SQL-шаблона');
    }

    return response.json();
};

export const addRow = async (tableName: string, rowData: any): Promise<void> => {
    const response = await fetch(`/api/tables/${tableName}/rows`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rowData),
    });

    if (!response.ok) {
        throw new Error('Не удалось добавить строку');
    }
};

export const fetchDatabaseInfo = async (): Promise<DatabaseInfo> => {
    const response = await fetch(`${BASE_URL}/api/database/info`);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке информации о базе данных');
    }
    return response.json();
};

export const fetchTableColumns = async (tableName: string): Promise<ColumnInfo[]> => {
    const response = await fetch(`${BASE_URL}/api/tables/${tableName}/columns`);
    if (!response.ok) {
        throw new Error(`Ошибка при загрузке столбцов для таблицы ${tableName}`);
    }
    return response.json();
};

export const fetchTableRows = async (tableName: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/tables/${tableName}/rows`);
    if (!response.ok) {
        throw new Error(`Ошибка при загрузке строк для таблицы ${tableName}`);
    }
    return response.json();
};

export const fetchSqlTemplates = async (): Promise<SqlTemplate[]> => {
    const response = await fetch('/api/database/sql-options');
    if (!response.ok) {
        throw new Error('Ошибка при загрузке SQL-запросов');
    }
    return response.json();
};

export const saveSqlTemplate = async (template: SqlTemplate): Promise<void> => {
    const response = await fetch('/api/database/sql-options', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
    });

    if (!response.ok) {
        throw new Error('Ошибка при сохранении SQL-шаблона');
    }
};

export const updateRow = async (tableName: string, id: string, updatedRow: any): Promise<void> => {

    const response = await fetch(`/api/tables/${tableName}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRow),
    });

    if (!response.ok) {
        throw new Error('Не удалось обновить строку');
    }
};

export const deleteRow = async (tableName: string, id: string): Promise<void> => {
    const response = await fetch(`/api/tables/${tableName}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Не удалось удалить строку');
    }
};

export const executeSqlQuerySimple = async (sqlQuery: string): Promise<TableData> => {
    const response = await fetch('/api/database/execute-sql-simple', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery }),
    });

    if (!response.ok) {
        throw new Error('Ошибка при выполнении SQL-запроса');
    }

    return response.json();
};


export const createTable = async (tableName: string, columns: { name: string; type: string; isPrimaryKey: boolean }[]) => {
    const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName, columns }),
    });
    if (!response.ok) {
        throw new Error('Failed to create table');
    }
    return response.json();
};

export const dropTable = async (tableName: string): Promise<void> => {
    const response = await fetch(`/api/tables/${tableName}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Ошибка при удалении таблицы');
    }
};
export const backupDatabase = async () => {
    const response = await fetch('/api/database/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Failed to create database backup');
    }
    return response.json(); // Ожидаем { "message": "..." }
};

export const restoreDatabase = async () => {
    const response = await fetch('/api/database/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Failed to restore database');
    }
    return response.json(); // Ожидаем { "message": "..." }
};
