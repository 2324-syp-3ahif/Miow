import express from "express";
import {isAuthenticated} from "../middleware/auth-handlers";
import {addEntry, getEntryByUserAndDate} from "../brain/entry_repo";
import {StatusCodes} from "http-status-codes";

export const entryRouter = express.Router();

//(yyyy-mm-dd) returns the entry from this day(so the user can edit it)
entryRouter.get("/day/:date",isAuthenticated,(req, res) =>{
    const currentUser = req.user.username;
    const requestedDate = req.params.date;
    const entry = getEntryByUserAndDate(currentUser,requestedDate);
    if (entry) {
        return res.status(StatusCodes.OK).json(entry);
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found or Entry not found" });
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