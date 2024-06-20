import {BaseEntry, Entry} from "../interfaces/entry";
import {User} from "../interfaces/user";
import {getUser, updateUser} from "./user_repo";
import {Week} from "../interfaces/week";
import {ReturnHelper} from "../interfaces/returnHelper";
import {StatusCodes} from "http-status-codes";

// Returns the Entry by User and Date
export function getEntryByUserAndDate(username: string, date: string): Entry | null {
    const user: User | undefined = getUser(username);
    if (!user) {
        return null;
    }
    var entry: Entry | undefined = user.entries.find((entry) => entry.date === date);
    if(entry==undefined){
        entry= BaseEntry;
    }
    return entry ? entry : null;
}


// Function to add an entry for a specific user
export function addEntry(username: string, entryData: Entry) {
    if (!isValidEntry(entryData)) {
        return null;
    }
    const user: User | undefined = getUser(username);
    if (!user) {
        return null;
    }
    const existingEntryIndex = user.entries.findIndex(entry => entry.date === entryData.date);
    if (existingEntryIndex != -1) {
        user.entries.splice(existingEntryIndex, 1);
    }
    const newEntry = entryData;
    user.entries.push(newEntry);
    updateUser(user);
    return newEntry;
}
// Function to validate entry data
function isValidEntry(entryData: Entry): ReturnHelper {
    if(!entryData){
        return {status:StatusCodes.BAD_REQUEST,response:"Unvalid Entrydata: Entrydata missing"}
    }
    else if(entryData.text.length>250){
        return {status:StatusCodes.BAD_REQUEST,response:"Unvalid Entrydata: Daily Text is too long(max 250)"}
    }
    else if(!entryData.date){
        return {status:StatusCodes.BAD_REQUEST,response:"Unvalid Entrydata: date is missing"}
    }
    else if(!isValidDateFormat(entryData.date)){
        return {status:StatusCodes.BAD_REQUEST,response:"Unvalid Entrydata: date is wrongly formattet"}
    }
    else if(entryData.mood<0||entryData.mood>5){
        return {status:StatusCodes.BAD_REQUEST,response:"Unvalid Entrydata: Mood is not in Range(0-5)"}
    }
    else if(!entryData.emotions){
        return {status:StatusCodes.BAD_REQUEST,response:"Unvalid Entrydata: emotions missing"}
    }
    else if(entryData.period<0||entryData.period>3){
        return {status:StatusCodes.BAD_REQUEST,response:"Unvalid Entrydata: Period not in range(0-3)"}
    }
    return {status:StatusCodes.OK,response:"Entry should be valid"}
}
//checks if string is in format "yyyy-mm-ddy"
function isValidDateFormat(dateString: string): boolean {
    const parts = dateString.split('-');
    if (parts.length !== 3) {
        return false;
    }
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    if (
        isNaN(year) || isNaN(month) || isNaN(day) ||
        year < 0 || month < 1 || month > 12 || day < 1 || day > 31
    ) {
        return false;
    }
    if ([4, 6, 9, 11].includes(month) && day > 30) {
        return false;
    }
    if (month === 2) {
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
            if (day > 29) {
                return false;
            }
        } else {
            if (day > 28) {
                return false;
            }
        }
    }
    return true;
}


//calculate the last day of the week
function getLastDayOfWeek(date: Date): Date {
    const lastDayOfWeek = new Date(date.getTime());
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() - lastDayOfWeek.getDay() + 6); // Adjust to Sunday
    return lastDayOfWeek;
}

//  get the weekly entry for a specific user
export function getWeekEntries(username: string, date: string): { year: number; startday: string; endday: string; text: string; entries: Entry[] } | null {
    const user: User | undefined = getUser(username);
    if (!user) {
        return null; // no user? insert megamind meme here
    }
    const weekEntries: Entry[] = user.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        const requestedDate = new Date(date);
        const firstDayOfWeek = new Date(requestedDate);
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
        const lastDayOfWeek = getLastDayOfWeek(firstDayOfWeek);
        return entryDate >= firstDayOfWeek && entryDate <= lastDayOfWeek;
    });
    const requestedDate = new Date(date);
    const firstDayOfWeek = new Date(requestedDate);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
    const lastDayOfWeek = getLastDayOfWeek(firstDayOfWeek);
    const week: Week | undefined = user.weeks.find(week => week.startday === date.slice(5));
    const text: string = week ? week.text : "";
    return {
        year: requestedDate.getFullYear(),
        startday: date.slice(5),
        endday: lastDayOfWeek.toISOString().slice(5, 10).replace('-', '_'),
        text: text,
        entries: weekEntries
    };
}

// add a weekly entry for a specific user and date
export function addWeekEntry(username: string, date: string, entryData: string): ReturnHelper {
    const user: User | undefined = getUser(username);
    if (!user) {
        return {status:StatusCodes.BAD_REQUEST,response:"user not found"}
    }
    if(entryData.length>500||entryData.length<0){
        return {status:StatusCodes.BAD_REQUEST,response:"entrydata too long (500 characters max)"}
    }
    const existingWeekIndex: number = user.weeks.findIndex(week => week.startday === date.slice(5));
    if (existingWeekIndex !== -1) {
        user.weeks[existingWeekIndex].text = entryData;
        updateUser(user);
        return {status:StatusCodes.ACCEPTED,response:"weekly entry added"}
    }
    const newWeekEntry: Week = {
        year: parseInt(date.slice(0, 4)),
        startday: date.slice(5),
        endday: getLastDayOfWeek(new Date(date)).toISOString().slice(5, 10).replace('-', '_'),
        text: entryData,
    };
    user.weeks.push(newWeekEntry);
    updateUser(user)
    return {status:StatusCodes.ACCEPTED,response:"weekly entry added"}
}