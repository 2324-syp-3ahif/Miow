import express from  "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import {User, UserCredentials} from "../interfaces/user";
import {isAuthenticated} from "../middleware/auth-handlers";
import {saltRounds} from "../interfaces/user";
import {addUser, loadUsersFromFile} from "../brain/user_repo";
dotenv.config();

export const authRouter = express.Router();

authRouter.get("/users", isAuthenticated, (request, response) => {
    response.status(StatusCodes.OK).json(loadUsersFromFile());
});
authRouter.post("/register", (req, res) => {
    let users: User[] = loadUsersFromFile();
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

authRouter.post("/login", (req, res) => {
    const loginUser: UserCredentials = req.body;
    const users: User[] = loadUsersFromFile();
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
        dotenv.config().parsed!.SECRET_KEY
    );
    res.status(StatusCodes.OK).json({
        userClaims: userClaims,
        expiresAt: expiresAt.getTime(),
        accessToken: token,
    });
});
