import 'dotenv/config'
import express from 'express'
import { sequelize } from './services/sequelize';
import path from 'path';
import * as exegesisExpress from "exegesis-express";

export async function createApp() {
    try {
        await sequelize.authenticate()
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
    }

    console.log('Connection to DB has been established successfully.');

    const options = {
        controllers: path.resolve(__dirname, "./controllers"),
        controllersPattern: "**/*.@(ts|js)"
    };

    const apiSpec = path.join(__dirname, './swagger.yaml');

    const exegesisMiddleware = await exegesisExpress.middleware(
        apiSpec,
        options
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