import express from  "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import {User, UserCredentials} from "../interfaces/user";
import {isAuthenticated} from "../middleware/auth-handlers";
import {saltRounds} from "../interfaces/user";
import {
    addUser,
    deleteUserByUsername,
    getUsers,
    updateUserByUsername,
    updateUserPassword
} from "../brain/user_repo";

import {writev} from "fs";
import path from "path";
dotenv.config();

export const authRouter = express.Router();

// Endpoint to change password
authRouter.put("/change-username", isAuthenticated, (req, res) => {
    const { newUsername } = req.body;
    const currentUser = req.user.username;
    if (newUsername === currentUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "New username must be different from the current one" });
    }
    const updated = updateUserByUsername(currentUser, newUsername);
    if (updated) {
        return res.status(StatusCodes.OK).json({ message: "Username updated successfully" });
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
});

// Endpoint to change password
authRouter.put("/change-password", isAuthenticated, (req, res) => {
    const { newPassword } = req.body;
    const username = req.user.username;
    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error hashing password" });
        }
        const updated = updateUserPassword(username, hash);
        if (updated) {
            return res.status(StatusCodes.OK).json({ message: "Password updated successfully" });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
        }
    });
});

//lets you delete a user
authRouter.delete("/delete", isAuthenticated, (req, res) => {
    const usernameToDelete = req.user.username; // Extract username from authenticated user
    const deleted = deleteUserByUsername(usernameToDelete);
    if (deleted) {
        return res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
});

//lets you register a user
authRouter.post("/register", (req : express.Request<{}, {}, UserCredentials>  , res) => {
    let users: User[] = getUsers();
    const newUser: UserCredentials = req.body;
    const existingUser = users.find(u => u.username === newUser.username);
    if (existingUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Username already exists" });
    }
    bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error hashing password" });
        }
        addUser(newUser.username, hash); // Store hashed password
        return res.status(StatusCodes.CREATED).json({ message: "User registered successfully" });
    });
});

//lets you log in
authRouter.post("/login", (req: express.Request<{}, {}, UserCredentials> , res) => {
    const loginUser: UserCredentials = req.body;
    const users: User[] = getUsers();
    const user = users.find((u) => u.username === loginUser.username);
    if (user === undefined) {
        res.status(StatusCodes.UNAUTHORIZED).json("User does not exist");
        return;
    }
    if (!bcrypt.compareSync(loginUser.password, user.password)) { // Compare plaintext password with stored hashed password
        res.status(StatusCodes.UNAUTHORIZED).json("Wrong password");
        return;
    }
    const userClaims = {
        username: user.username
    };
    const minutes = 60;
    const expiresAt = new Date(Date.now() + minutes * 60000);
    const token = jwt.sign(
        {
            user: userClaims,
            exp: expiresAt.getTime() / 1000,
        },
       "secretkey"
    );
    res.status(StatusCodes.OK).json({
        userClaims: userClaims,
        expiresAt: expiresAt.getTime(),
        accessToken: token,
    });

    res.send("Login successful");
});
