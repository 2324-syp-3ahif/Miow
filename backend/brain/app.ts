import express from "express";
import {authRouter} from "../routers/auth-router";
import dotenv from "dotenv";
import {entryRouter} from "../routers/entry-router";
import {evaluateRouter} from "../routers/evaluate-router";
import {settingsRouter} from "../routers/setting-router";
import {keineahnung} from "./dbrepo";
import cors from "cors";

dotenv.config();
require('dotenv').config();
export const app = express();
app.use(express.json());
app.use(express.static("frontend"));
//routers
app.use("/auth",authRouter);
app.use("/entry",entryRouter);
app.use("/evaluate",evaluateRouter);
app.use("/settings",settingsRouter);
app.use(cors());
app.listen(3000, async () => {
    console.log("Server is listening at http://localhost:3000");
    await keineahnung();
});