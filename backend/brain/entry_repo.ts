import {Entry} from "../interfaces/entry";
import {User} from "../interfaces/user";
import {getUser, updateUser} from "./user_repo";
import {Week} from "../interfaces/week";
// Returns the Entry by User and Date
export function getEntryByUserAndDate(username: string, date: string): Entry | null {
    const user: User | undefined = getUser(username);
    if (!user) {
        return null;
    }
    const entry: Entry | undefined = user.entries.find((entry) => entry.fixed_blocks.date === date);
    return entry ? entry : null;
}

// Function to add an entry for a specific user
export function addEntry(username:string, entryData:Entry) {
    const user: User | undefined = getUser(username);
    if (!user) {
        return null;
    }
    const existingEntryIndex = user.entries.findIndex(entry => entry.fixed_blocks.date === entryData.fixed_blocks.date);
    if (existingEntryIndex != -1) {
        user.entries.splice(existingEntryIndex, 1);
    }
    const newEntry = {
        fixed_blocks:entryData.fixed_blocks,
        icon_blocks: entryData.icon_blocks,
        number_blocks: entryData.number_blocks
    };
    user.entries.push(newEntry);
    updateUser(user);
    return newEntry;
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
        const entryDate = new Date(entry.fixed_blocks.date);
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
export function addWeekEntry(username: string, date: string, entryData: string): boolean {
    const user: User | undefined = getUser(username);
    if (!user) {
        return false;
    }
    const existingWeekIndex: number = user.weeks.findIndex(week => week.startday === date.slice(5));
    if (existingWeekIndex !== -1) {
        user.weeks[existingWeekIndex].text = entryData;
        updateUser(user);
        return true;
    }
    const newWeekEntry: Week = {
        year: parseInt(date.slice(0, 4)),
        startday: date.slice(5),
        endday: getLastDayOfWeek(new Date(date)).toISOString().slice(5, 10).replace('-', '_'),
        text: entryData,
    };
    user.weeks.push(newWeekEntry);
    updateUser(user)
    return true;
}