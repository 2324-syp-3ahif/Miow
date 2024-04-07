import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

//checks if given toke is provided, good formatet and valid
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token not provided" });
    }
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token format" });
    }
    const tokenValue = tokenParts[1];
    jwt.verify(tokenValue, secretKey!, (err: any, decoded: any) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token" });
        }
        req.user = decoded.user;
        next();
    });
};