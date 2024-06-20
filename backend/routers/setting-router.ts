import express from "express";
import {isAuthenticated} from "../middleware/auth-handlers";
import {User} from "../interfaces/user";
import {getUser, updateUser} from "../brain/user_repo";
import {StatusCodes} from "http-status-codes";
import {aboutUs, privacyPolicy, termsOfService} from "../brain/setting_repo";

export const settingsRouter = express.Router();


// PUT update user settings
settingsRouter.put("", isAuthenticated, (req, res) => {
    const settingsData = req.body;
    const user: User | undefined = getUser(req.user.username);
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    if(user.settings.themeNR<0||user.settings.themeNR>6){
        return res.status(StatusCodes.BAD_REQUEST).json("Unvalid: theme number not in range(0-6)")
    }
    user.settings.themeNR = settingsData.themeNR;
    user.settings.trackPeriod = settingsData.trackPeriod;
    updateUser(user)
    return res.status(StatusCodes.OK).json({ message: "Settings updated successfully" });
});

// GET retrieve user settings
settingsRouter.get("", isAuthenticated, (req, res) => {
    const user: User | undefined = getUser(req.user.username);
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    const u = user.settings;
    return res.status(StatusCodes.OK).json({ u, aboutUs, termsOfService, privacyPolicy });
});