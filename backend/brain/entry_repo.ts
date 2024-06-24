import {BaseEntry, Entry} from "../interfaces/entry";
import {User} from "../interfaces/user";
import {getUser, updateUser} from "./user_repo";
import {Week} from "../interfaces/week";
import {ReturnHelper} from "../interfaces/returnHelper";
import {StatusCodes} from "http-status-codes";
import {getMonthData} from "./evaluate_repo";
import {MonthData} from "../interfaces/monthdata";

// Returns the Entry by User and Date
export function getEntryByUserAndDate(username: string, date: string): Entry | null {
    const user: User | undefined = getUser(username);
    if (!user) {
        return null;
    }

    const entry: Entry | undefined = user.entries.find((entry) => entry.date === date);
    const monthData = getMonthData(username, date);

    const day = date.split('-')[2];  // Assumes date is in 'YYYY-MM-DD' format

    const dayData = monthData?.values.find(d => d.day === day);
    const period = dayData ? dayData.period : 2;  // Default period if dayData is not found

    if (entry === undefined) {
        return { ...BaseEntry, date, period };
    } else {
        return { ...entry, period };
    }
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

export function getWeekEntries(username: string, date: string): any | null {
    const user: User | undefined = getUser(username);
    if (!user) {
        return null;
    }

    const requestedDate = new Date(date);
    const firstDayOfWeek = getFirstDayOfWeek(requestedDate);
    const lastDayOfWeek = getLastDayOfWeek(firstDayOfWeek);

    const firstMonthDate = `${firstDayOfWeek.getFullYear()}-${(firstDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}-01`;
    const lastMonthDate = `${lastDayOfWeek.getFullYear()}-${(lastDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}-01`;

    const monthDataArray = [getMonthData(username, firstMonthDate)];
    if (firstMonthDate !== lastMonthDate) {
        monthDataArray.push(getMonthData(username, lastMonthDate));
    }

    const weekEntries: Entry[] = [];
    monthDataArray.forEach((monthData) => {
        monthData?.values.forEach((dayData: { day: string; mood: number; period: number }) => {
            const entryDate = `${monthData.Date.slice(0, 7)}-${dayData.day.padStart(2, '0')}`;
            const entryDateObj = new Date(entryDate);
            if (entryDateObj >= firstDayOfWeek && entryDateObj <= lastDayOfWeek) {
                const userEntry = user.entries.find(entry => entry.date === entryDate);
                weekEntries.push({
                    ...BaseEntry,
                    date: entryDate,
                    mood: dayData.mood,
                    period: dayData.period,
                    text: userEntry ? userEntry.text : ""
                });
            }
        });
    });

    const days: { [key: string]: { Mood: number, Period: number, text: string } } = {
        Monday: { Mood: 0, Period: 0, text: "" },
        Tuesday: { Mood: 0, Period: 0, text: "" },
        Wednesday: { Mood: 0, Period: 0, text: "" },
        Thursday: { Mood: 0, Period: 0, text: "" },
        Friday: { Mood: 0, Period: 0, text: "" },
        Saturday: { Mood: 0, Period: 0, text: "" },
        Sunday: { Mood: 0, Period: 0, text: "" }
    };

    weekEntries.forEach((entry: Entry) => {
        const entryDate = new Date(entry.date);
        const dayName = entryDate.toLocaleDateString('en-US', { weekday: 'long' });
        if (days[dayName]) {
            days[dayName].Mood = entry.mood;
            days[dayName].Period = entry.period;
            days[dayName].text = entry.text;
        }
    });
    const week: Week | undefined = user.weeks.find(week => week.startday === date.slice(5));
    const text: string = week ? week.text : "";
    return {
        requestedDate: `${requestedDate.getFullYear()}-${(requestedDate.getMonth() + 1).toString().padStart(2, '0')}-${requestedDate.getDate()}`,
        weekStartDay: `${firstDayOfWeek.getFullYear()}-${(firstDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}-${firstDayOfWeek.getDate()}`,
        weekEndDay: `${lastDayOfWeek.getFullYear()}-${(lastDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfWeek.getDate()}`,
        text: text,
        Days: days
    };
}

// Calculate the first day of the week (Monday)
function getFirstDayOfWeek(date: Date): Date {
    const copiedDate = new Date(date.getTime());
    let dayOfWeek = copiedDate.getDay();
    let diff = dayOfWeek - 1;
    if (dayOfWeek === 0) {
        diff = 6;
    }
    copiedDate.setDate(copiedDate.getDate() - diff);
    return copiedDate;
}

// Calculate the last day of the week (Sunday)
function getLastDayOfWeek(date: Date): Date {
    const lastDayOfWeek = new Date(date);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    return lastDayOfWeek;
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