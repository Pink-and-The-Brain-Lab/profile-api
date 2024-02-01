import "reflect-metadata";
import { DataSource } from "typeorm";
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5434,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [
        
    ],
    migrations: [
        
    ],
    subscribers: [],
})
