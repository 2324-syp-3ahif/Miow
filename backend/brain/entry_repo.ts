import {Entry} from "../interfaces/entry";
import {User} from "../interfaces/user";
import {getUsers} from "./user_repo";
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
