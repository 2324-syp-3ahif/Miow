import express from "express";
import {authRouter} from "../routers/auth-router";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
require('dotenv').config();


export const app = express();


app.use(express.json());
app.use(express.static("frontend"));


//routers
app.use("/api/auth",authRouter);

app.listen(3000, () => {
    console.log("Server is listening at http://localhost:3000");
});