import express from "express";
import {authRouter} from "../routers/auth-router";

export const app = express();
app.use(express.json());
app.use(express.static("public"));
//routers
app.use("/api/auth",authRouter)
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});