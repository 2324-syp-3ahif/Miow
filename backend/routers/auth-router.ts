import express from  "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import {users} from "../test_data/user_data";
import {UserCredentials} from "../interfaces/user";
dotenv.config();
export const authRouter = express.Router();

authRouter.get("/users", (req, res) => {
    res.status(StatusCodes.OK).json(users);
});

authRouter.post("/login", (req, res) => {
    const loginUser: UserCredentials = req.body;
    const user = users.find((user) => user.username === loginUser.email);
    if (user === undefined) {
        res
            .status(StatusCodes.UNAUTHORIZED)
            .json("User does not exist");
        return;
    }
    if (!bcrypt.compareSync(loginUser.password, user.password)) {
        res
            .status(StatusCodes.UNAUTHORIZED)
            .json("Invalid password");
        return;
    }
    const userClaims = {
        email: user.username,
    };
    const minutes = 15;
    const expiresAt = new Date(Date.now() + minutes * 60000);
    const token = jwt.sign(
        {
            user: userClaims,
            exp: expiresAt.getTime() / 1000,
        },
        process.env.SECRET_KEY as string,
    );
    res.status(StatusCodes.OK).json({
        userClaims: user,
        expiresAt: expiresAt.getTime(),
        accessToken: token,
    });
});