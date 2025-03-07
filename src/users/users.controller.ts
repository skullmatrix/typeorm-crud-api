// src/users/users.controller.ts
import express from "express";
import Joi from "joi";
import { validateRequest } from "../_middleware/validate-request";
import userService from "./user.service"; // Correct import for default export

const router = express.Router();

// Get all users
router.get("/", getAll);

// Get a user by ID
router.get("/:id", getById);

// Create a new user
router.post("/", createSchema, create);

// Update a user
router.put("/:id", updateSchema, update);

// Delete a user
router.delete("/:id", _delete);

// Route functions
async function getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
}

async function getById(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const user = await userService.getById(req.params.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function create(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        await userService.create(req.body);
        res.json({ message: "User created" });
    } catch (error) {
        next(error);
    }
}

async function update(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        await userService.update(req.params.id, req.body);
        res.json({ message: "User updated" });
    } catch (error) {
        next(error);
    }
}

async function _delete(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        await userService.delete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error) {
        next(error);
    }
}

// Validation schemas
function createSchema(req: express.Request, res: express.Response, next: express.NextFunction) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
    });
    validateRequest(req, res, next, schema);
}

function updateSchema(req: express.Request, res: express.Response, next: express.NextFunction) {
    const schema = Joi.object({
        title: Joi.string().empty(""),
        firstName: Joi.string().empty(""),
        lastName: Joi.string().empty(""),
        email: Joi.string().email().empty(""),
        password: Joi.string().min(5).empty(""),
    });
    validateRequest(req, res, next, schema);
}

export default router;