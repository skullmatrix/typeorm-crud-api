// src/users/user.service.ts
import bcrypt from "bcryptjs";
import { User } from "./user.model";
import { db } from "../_helpers/db";

// Define the user service methods
const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

// Get all users
async function getAll() {
    if (!db.connection) throw new Error("Database connection not established");
    return await db.connection.getRepository(User).find();
}

// Get a user by ID
async function getById(id: string) {
    if (!db.connection) throw new Error("Database connection not established");
    const user = await db.connection.getRepository(User).findOne({ where: { id } });
    if (!user) throw new Error("User not found");
    return user;
}

// Create a new user
async function create(params: any) {
    if (!db.connection) throw new Error("Database connection not established");

    // Validate required fields
    if (!params.email || !params.password || !params.username) {
        throw new Error("Email, username, and password are required");
    }

    // Check if the email or username is already registered
    const existingUser = await db.connection.getRepository(User).findOne({
        where: [{ email: params.email }, { username: params.username }],
    });
    if (existingUser) {
        throw new Error("Email or username is already registered");
    }

    // Create a new user
    const user = new User();
    Object.assign(user, params);
    user.passwordHash = await bcrypt.hash(params.password, 10);

    // Save the user to the database
    await db.connection.getRepository(User).save(user);
    return user;
}

// Update a user
async function update(id: string, params: any) {
    if (!db.connection) throw new Error("Database connection not established");

    // Get the user by ID
    const user = await getUser(id);

    // Check if the new email or username is already registered
    if (params.email && user.email !== params.email) {
        const existingUser = await db.connection.getRepository(User).findOne({ where: { email: params.email } });
        if (existingUser) {
            throw new Error(`Email "${params.email}" is already registered`);
        }
    }
    if (params.username && user.username !== params.username) {
        const existingUser = await db.connection.getRepository(User).findOne({ where: { username: params.username } });
        if (existingUser) {
            throw new Error(`Username "${params.username}" is already registered`);
        }
    }

    // Hash the password if it was updated
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // Update the user
    Object.assign(user, params);
    await db.connection.getRepository(User).save(user);
    return user;
}

// Delete a user
async function _delete(id: string) {
    if (!db.connection) throw new Error("Database connection not established");

    // Get the user by ID
    const user = await getUser(id);

    // Delete the user
    await db.connection.getRepository(User).remove(user);
}

// Helper function to get a user by ID
async function getUser(id: string) {
    if (!db.connection) throw new Error("Database connection not established");
    const user = await db.connection.getRepository(User).findOne({ where: { id } });
    if (!user) throw new Error("User not found");
    return user;
}

// Export the user service as default
export default userService;