import 'dotenv/config'
import express from 'express'
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';
import prisma from './prisma';
import swaggerUi from 'swagger-ui-express'
import YAML from 'yaml'
import fs from 'fs'

export async function createApp() {
    try {
        await prisma.$connect()
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
    }

    console.log('Connection to DB has been established successfully.');

    const apiSpec = path.join(__dirname, './openapi.yaml');
    const apiSpecFile = fs.readFileSync(apiSpec, 'utf8')
    const swaggerDocument = YAML.parse(apiSpecFile)

    const app: express.Application = express();

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(express.json())

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