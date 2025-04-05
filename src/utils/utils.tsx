// src/utiles/utiles.tsx
const toSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const toCamelCase = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
// Преобразует ключи объекта из camelCase в snake_case (например, clientId → client_id)
const normalizeKeysToSnakeCase = (obj: any): any => {
    const newObj: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const snakeKey = toSnakeCase(key);
            newObj[snakeKey] = obj[key]; // Значение остаётся неизменным
        }
    }
    return newObj;
};

// Преобразует ключи объекта из snake_case в camelCase (например, client_id → clientId)
const normalizeKeysToCamelCase = (obj: any): any => {
    const newObj: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelKey = toCamelCase(key);
            newObj[camelKey] = obj[key]; // Значение остаётся неизменным
        }
    }
    return newObj;
};
export {normalizeKeysToCamelCase,normalizeKeysToSnakeCase}