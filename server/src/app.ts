import 'dotenv/config'
import express from 'express'
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';
import prisma from './prisma';

export async function createApp() {
    try {
        await prisma.$connect()
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
    }

    console.log('Connection to DB has been established successfully.');

    const apiSpec = path.join(__dirname, './openapi.yaml');

    const app: express.Application = express();

    app.use(express.json())

    app.use('/spec', express.static(apiSpec));

    app.use(
        OpenApiValidator.middleware({
            apiSpec,
            validateRequests: true,
            validateResponses: true,
            operationHandlers: path.join(__dirname, './controllers'),
        }),
    );

    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
    });

    return app
}