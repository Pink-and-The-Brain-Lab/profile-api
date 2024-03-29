import "reflect-metadata";
import { DataSource } from "typeorm";
import 'dotenv/config';
import { UserProfile1706998803968 } from "./database/migrations/1706998803968-UserProfile";
import Profile from "./models/profile.model";
import { AddColumnSelected1708562189770 } from "./database/migrations/1708562189770-AddColumnSelected";
import { AddColumnLanguage1709500814057 } from "./database/migrations/1709500814057-AddColumnLanguage";
import { AddColumnCreatedAt1709927126156 } from "./database/migrations/1709927126156-AddColumnCreatedAt";

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
        AddColumnSelected1708562189770,
        AddColumnLanguage1709500814057,
        AddColumnCreatedAt1709927126156,
    ],
    subscribers: [],
})
