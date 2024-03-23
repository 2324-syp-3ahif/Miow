import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error("No bearer token available");
        }
        // check if the token is valid => otherwise an error is thrown
        jwt.verify(token, dotenv.config().parsed!.SECRET_KEY);
        next();
    } catch (err) {
        res.status(401).send(`Please authenticate! ${err}`);
    }
    next();
};
