import express from "express";
import { initialize } from "./_helpers/db";
import usersRouter from "./users/users.controller";

const app = express();


initialize()
    .then(() => {
        console.log("Database initialized successfully.");
    })
    .catch((error) => {
        console.error("Failed to initialize the database:", error);
        process.exit(1);
    });


app.use(express.json());


app.use("/users", usersRouter);

const port = process.env.PORT || 1569;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});