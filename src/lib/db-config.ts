
/**
 * PostgreSQL Database Configuration
 * 
 * This file provides configuration for connecting to a PostgreSQL database.
 * For production, use environment variables for sensitive information.
 */

export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

/**
 * Default database configuration for development
 * In production, use environment variables
 */
export const getDbConfig = (): DbConfig => {
  return {
    host: process.env.VITE_PG_HOST || 'localhost',
    port: parseInt(process.env.VITE_PG_PORT || '5432'),
    database: process.env.VITE_PG_DATABASE || 'personnel_directory',
    user: process.env.VITE_PG_USER || 'postgres',
    password: process.env.VITE_PG_PASSWORD || 'postgres',
    ssl: process.env.VITE_PG_SSL === 'true',
  };
};
