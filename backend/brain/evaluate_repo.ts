import {User} from "../interfaces/user";
import {getUsers} from "./user_repo";

//retrieve month data for the specified user and date
export function getMonthData(username: string, date: string): { Date: string; values: { [day: string]: { mood: number; period: number } } } | null {
    const users: User[] = getUsers();
    const user: User | undefined = users.find(user => user.username === username);
    if (!user) {
        return null; // no user? insert megamind meme here
    }
    const [year, month] = date.split("-");
    const monthNumber = parseInt(month, 10);
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
        return null;
    }
    const monthData = {
        Date: date,
        values: {} as { [day: string]: { mood: number; period: number } }
    };
    user.entries.forEach(entry => {
        const entryDate = entry.fixed_blocks.date;
        const [entryYear, entryMonth] = entryDate.split("-");
        if (entryYear === year && entryMonth === month) {// If entry date is within the specified month, add its data to monthData
            const day = entryDate.split("-")[2];
            monthData.values[day] = {
                mood: entry.fixed_blocks.mood,
                period: entry.fixed_blocks.period
            };
        }
    });
    return monthData;
}