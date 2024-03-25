import {Entry} from "../interfaces/entry";
import {User} from "../interfaces/user";
import {getUsers,saveUsers} from "./user_repo";
import {Week} from "../interfaces/week";
// Returns the Entry by User and Date
export function getEntryByUserAndDate(username: string, date: string): Entry | null {
    const users: User[] = getUsers();
    const user: User | undefined = users.find((user) => user.username === username);
    if (!user) {
        return null;
    }
    const entry: Entry | undefined = user.entries.find((entry) => entry.fixed_blocks.date === date);
    return entry ? entry : null;
}
// Function to add an entry for a specific user
export function addEntry(username:string, entryData:Entry) {
    let users = getUsers();
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return null;
    }
    const existingEntryIndex = users[userIndex].entries.findIndex(entry => entry.fixed_blocks.date === entryData.fixed_blocks.date);
    if (existingEntryIndex !== -1) {
        users[userIndex].entries.splice(existingEntryIndex, 1);
    }
    const newEntry = {
        fixed_blocks:entryData.fixed_blocks,
        icon_blocks: entryData.icon_blocks,
        number_blocks: entryData.number_blocks
    };
    users[userIndex].entries.push(newEntry);
    saveUsers(users);
    return newEntry;
}



function getLastDayOfWeek(date: Date): Date {
    const lastDayOfWeek = new Date(date.getTime());
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() - lastDayOfWeek.getDay() + 6); // Adjust to Sunday
    return lastDayOfWeek;
}

//  get the weekly entries for a specific user
export function getWeekEntries(username: string, date: string): { year: number; startday: string; endday: string; text: string; entries: Entry[] } | null {
    const users: User[] = getUsers();
    const user: User | undefined = users.find(user => user.username === username);
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
    const text: string = week ? week.text : "No weekly text available";
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
    const users: User[] = getUsers();
    const userIndex: number = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return false;  // User not found
    }
    const user: User = users[userIndex];
    const existingWeekIndex: number = user.weeks.findIndex(week => week.startday === date.slice(5));
    if (existingWeekIndex !== -1) {
        user.weeks[existingWeekIndex].text = entryData;
        saveUsers(users);
        return true;
    }
    const newWeekEntry: Week = {
        year: parseInt(date.slice(0, 4)),
        startday: date.slice(5),
        endday: getLastDayOfWeek(new Date(date)).toISOString().slice(5, 10).replace('-', '_'),
        text: entryData,
    };
    user.weeks.push(newWeekEntry);
    users[userIndex] = user;
    saveUsers(users);
    return true;
}