import express from "express";
import {isAuthenticated} from "../middleware/auth-handlers";
import {getMonthData} from "../brain/evaluate_repo";
import {StatusCodes} from "http-status-codes";

export const evaluateRouter = express.Router();

// GET retrieve month data from the day given
evaluateRouter.get("", isAuthenticated, (req, res) => {
    const  date  = req.body.date;
    const currentUser = req.user.username;
    const monthData = getMonthData(currentUser, date);
    if (monthData) {
        return res.status(StatusCodes.OK).json(monthData);
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Month data not found" });
    }
});