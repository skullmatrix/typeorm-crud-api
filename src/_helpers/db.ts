import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import mysql from "mysql2/promise"; // Import mysql2 for creating the database
import config from "../config";
import { User } from "../users/user.model";

export const db = {
    connection: null as Connection | null,
    User: null as typeof User | null,
};

export async function initialize() {
    try {
        const { host, port, user, password, database } = config.database;

        // Step 1: Create the database if it doesn't exist
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();

        // Step 2: Connect to the database using TypeORM
        db.connection = await createConnection({
            type: "mysql",
            host,
            port,
            username: user,
            password,
            database,
            entities: [User],
            synchronize: true, // Automatically sync database schema
            logging: true, // Enable logging for debugging
        });

        console.log("Database connection established.");
        db.User = User;
        console.log("Database synchronized.");
    } catch (error) {
        console.error("Database initialization failed:", error);
        throw error;
    }
}