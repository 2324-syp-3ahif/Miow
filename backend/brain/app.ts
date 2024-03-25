import express from "express";
import {authRouter} from "../routers/auth-router";
import dotenv from "dotenv";
import path from "path";
import {entryRouter} from "../routers/entry-router";
import {evaluateRouter} from "../routers/evaluate-router";

dotenv.config();
require('dotenv').config();


export const app = express();


app.use(express.json());
app.use(express.static("frontend"));


//routers
app.use("/api/auth",authRouter);
app.use("/api/entry",entryRouter);
app.use("/api/evaluate",evaluateRouter);

app.listen(3000, () => {
    console.log("Server is listening at http://localhost:3000");
});