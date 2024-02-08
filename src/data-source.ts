import "reflect-metadata";
import { DataSource } from "typeorm";
import 'dotenv/config';
import { UserProfile1706998803968 } from "./database/migrations/1706998803968-UserProfile";
import Profile from "./models/profile.model";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5434,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: "postgres",
    synchronize: false,
    logging: false,
    entities: [
        Profile,
    ],
    migrations: [
        UserProfile1706998803968,
    ],
    subscribers: [],
})
