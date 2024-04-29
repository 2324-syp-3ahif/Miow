import express from "express";
import {isAuthenticated} from "../middleware/auth-handlers";
import {addEntry, addWeekEntry, getEntryByUserAndDate, getWeekEntries} from "../brain/entry_repo";
import {StatusCodes} from "http-status-codes";

export const entryRouter = express.Router();

//(yyyy-mm-dd) returns the entry from this day(so the user can edit it)
entryRouter.get("/day",isAuthenticated,(req, res) =>{
    const currentUser = req.user.username;
    const requestedDate = req.body.date;
    const entry = getEntryByUserAndDate(currentUser,requestedDate);
    if (entry) {
        return res.status(StatusCodes.OK).json(entry);
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
});

// POST endpoint to add an entry for a specific day
entryRouter.post("/day", isAuthenticated, (req, res) => {
    const currentUser = req.user.username;
    const entryData = req.body;
    const addedEntry = addEntry(currentUser, entryData);
    if (addedEntry) {
        return res.status(StatusCodes.OK).json("Succsessfully added Entry!");
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to add entry" });
    }
});

// GET retrieve the users weekly entries
entryRouter.get("/week", isAuthenticated, (req, res) => {
    const currentUser = req.user.username;
    const requestedDate = req.body.date;
    const weekEntries = getWeekEntries(currentUser, requestedDate);
    if (weekEntries) {
        return res.status(200).json(weekEntries);
    } else {
        return res.status(404).json({ error: "Week entries not found" });
    }
});

// POST  add a weekly entry for a specific date
entryRouter.post("/week", isAuthenticated, (req,res) => {
    const { date } = req.body.date;
    const { entryData } = req.body.entryData;
    const currentUser = req.user.username;
    const addedEntry = addWeekEntry(currentUser, date, entryData);
    if (addedEntry) {
        return res.status(StatusCodes.OK).json("Successfully added weekly entry!");
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to add weekly entry" });
    }
});