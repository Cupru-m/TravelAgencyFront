import { normalizeKeysToCamelCase } from "../utils/utils";

interface ColumnInfo {
    name: string;
    type: string;
}

interface DatabaseInfo {
    dbName: string;
    tables: string[];
}

export interface SqlTemplate { // Переименован SqlOption в SqlTemplate
    name: string;
    query: string;
}

export interface TableData {
    columns: ColumnInfo[];
    rows: any[];
}

const BASE_URL = '';
export const executeSqlTemplate = async (templateName: string, tableName: string): Promise<TableData> => {
    const response = await fetch('/api/execute-sql-template', {
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
    rowData = normalizeKeysToCamelCase(rowData);
    const response = await fetch(`/api/${tableName.toLowerCase()}`, {
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
    const response = await fetch(`${BASE_URL}/api/database-info`);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке информации о базе данных');
    }
    return response.json();
};

export const fetchTableColumns = async (tableName: string): Promise<ColumnInfo[]> => {
    const response = await fetch(`${BASE_URL}/api/${tableName.toLowerCase()}/columns`);
    if (!response.ok) {
        throw new Error(`Ошибка при загрузке столбцов для таблицы ${tableName}`);
    }
    return response.json();
};

export const fetchTableRows = async (tableName: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/${tableName.toLowerCase()}`);
    if (!response.ok) {
        throw new Error(`Ошибка при загрузке строк для таблицы ${tableName}`);
    }
    return response.json();
};

export const fetchSqlTemplates = async (): Promise<SqlTemplate[]> => { // Переименован fetchSqlOptions
    const response = await fetch('/api/sql-options');
    if (!response.ok) {
        throw new Error('Ошибка при загрузке SQL-запросов');
    }
    return response.json();
};


export const saveSqlTemplate = async (template: SqlTemplate): Promise<void> => { // Новая функция для сохранения шаблона
    const response = await fetch('/api/sql-options', {
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
    updatedRow = normalizeKeysToCamelCase(updatedRow);
    const response = await fetch(`/api/${tableName}/${id}`, {
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
    const response = await fetch(`/api/${tableName}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Не удалось удалить строку');
    }
};
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
export const executeSqlQuerySimple = async (sqlQuery: string): Promise<TableData> => {
    const response = await fetch('/api/execute-sql-simple', {
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