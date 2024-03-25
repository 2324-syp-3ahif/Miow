import {Entry} from "../interfaces/entry";
import {User} from "../interfaces/user";
import {getUsers,saveUsers} from "./user_repo";
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
    // Get the list of users
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
