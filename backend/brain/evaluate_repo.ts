import { User } from "../interfaces/user";
import { getUser } from "./user_repo";

// Retrieve period data for the specified user and date(yyyy-mm-dd)
//TODO: bro ich hab keine ahnung was ich hier fabriziert hab, muss mich mehr damit auseinander setzen
export function getMonthData(username: string, date: string): any {
    const userData: User | undefined = getUser(username);
    const [year, month] = date.split('-');
    const monthData: any = {
        Date: `${year}-${month}`,
        values: {}
    };
    for (const entry of userData!.entries) {
        const entryDate = entry.fixed_blocks.date;
        const [entryYear, entryMonth] = entryDate.split('-');
        if (entryYear === year && entryMonth === month) {
            const day = entryDate.split('-')[2];
            monthData.values[day] = {
                mood: entry.fixed_blocks.mood,
                period: entry.fixed_blocks.period
            };
        }
    }
    return monthData;
}