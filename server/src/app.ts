import 'dotenv/config'
import express from 'express'
import path from 'path';
import * as exegesisExpress from "exegesis-express";
import prisma from './prisma';
import * as pingController from './controllers/ping';
import * as reservationsController from './controllers/reservations';
import * as propertiesController from './controllers/properties';


export async function createApp() {
    try {
        await prisma.$connect()
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
    }

    console.log('Connection to DB has been established successfully.');

    const apiSpec = path.join(__dirname, './swagger.yaml');

    const exegesisMiddleware = await exegesisExpress.middleware(
        apiSpec,
        {
            controllers: {
                ping: {
                    ...pingController
                },
                reservations: {
                    ...reservationsController
                },
                properties: {
                    ...propertiesController
                }
            },
            controllersPattern: "**/*.@(ts|js)"
        }
    );

    const app: express.Application = express();

    app.use(exegesisMiddleware);

    app.use(express.json())

    app.use('/spec', express.static(apiSpec));

    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
    });

    return app
}