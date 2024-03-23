import express from  "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import {users} from "../test_data/user_data";
import {UserCredentials} from "../interfaces/user";
import {isAuthenticated} from "../middleware/auth-handlers";
dotenv.config();
export const authRouter = express.Router();

// return all users
authRouter.get("/users", isAuthenticated, (request, response) => {
    response.status(StatusCodes.OK).json(users);
});
authRouter.post("/login", (req, res) => {
    const loginUser: UserCredentials = req.body;
    const user = users.find((u) => u.username === loginUser.username);
    if (user === undefined) {
        res.status(StatusCodes.UNAUTHORIZED).json("User does not exist");
        return;
    }
    if (!bcrypt.compareSync(loginUser.password, user.password)) {
        res.status(StatusCodes.UNAUTHORIZED).json("Wrong password");
        return;
    }
    const userClaims = {
        username: user.username
    };
    const minutes = 30;
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