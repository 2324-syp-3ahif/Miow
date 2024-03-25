import express from "express";
import {isAuthenticated} from "../middleware/auth-handlers";
import {User} from "../interfaces/user";
import {getUsers, saveUsers} from "../brain/user_repo";
import {StatusCodes} from "http-status-codes";
import {aboutUs, privacyPolicy, termsOfService} from "../brain/setting_repo";

export const settingsRouter = express.Router();


// PUT update user settings
settingsRouter.put("", isAuthenticated, (req, res) => {
    const currentUser = req.user.username;
    const settingsData = req.body;
    const users: User[] = getUsers();
    const userIndex: number = users.findIndex(user => user.username === currentUser);
    if (userIndex === -1) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    const user: User = users[userIndex];
    user.settings.themeNR = settingsData.ThemeNR;
    user.settings.entrySettings = settingsData.entrySettings;
    user.settings.trackPeriod = settingsData.trackPeriod;
    user.settings.privacyPolicy= privacyPolicy;
    user.settings.aboutUs=aboutUs;
    user.settings.termsOfService=termsOfService;
    users[userIndex] = user;
    saveUsers(users);
    return res.status(StatusCodes.OK).json({ message: "Settings updated successfully" });
});

// GET retrieve user settings
settingsRouter.get("", isAuthenticated, (req, res) => {
    const currentUser = req.user.username;
    const users: User[] = getUsers();
    const user = users.find(user => user.username === currentUser);
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    const { aboutUs, termsOfService, privacyPolicy, ...userSettings } = user.settings;
    return res.status(StatusCodes.OK).json({ ...userSettings, aboutUs, termsOfService, privacyPolicy });
});