import dotenv from 'dotenv';
import status from 'http-status';
import AppError from '../app/helpers/AppError';

dotenv.config();

interface EnvConfig {
    NODE_ENV: string;
    PORT: string;
    APP_URL: string;
    DATABASE_URL: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariable = [
        'NODE_ENV',
        'PORT',
        'APP_URL',
        'DATABASE_URL',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_PRIVATE_KEY',
    ]

    requiredEnvVariable.forEach((variable) => {
        if (!process.env[variable]) {
            throw new AppError(
                status.INTERNAL_SERVER_ERROR,
                `Environment variable ${variable} is required but not set in .env file.`
            )
        }
    })

    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        APP_URL: process.env.APP_URL as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID as string,
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL as string,
        FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY as string,
    }
}

export const envVars = loadEnvVariables();