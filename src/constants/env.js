import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const HOST = process.env.HOST || 'localhost';

export const DB_NAME = process.env.DB_NAME || '';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 3306;

export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';
