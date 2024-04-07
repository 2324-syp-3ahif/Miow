import { User } from "../interfaces/user";
import { getUser } from "./user_repo";

// Retrieve period data for the specified user and date
//TODO: bro ich hab keine ahnung was ich hier fabriziert hab, muss mich mehr damit auseinander setzen
export function getMonthData(username: string, date: string): { Date: string; values: { [day: string]: { mood: number; period: number } } } | null {
    const user: User | undefined = getUser(username);
    if (!user) {
        return null; // User not found
    }
    const [year, month] = date.split("-");
    const monthNumber = parseInt(month, 10);
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
        return null; // Invalid date
    }
    // Initialize month data
    const monthData = {
        Date: date,
        values: {} as { [day: string]: { mood: number; period: number } }
    };
    // Filter entries for  last 6 monts
    const relevantEntries = user.entries.filter(entry => {
        const [entryYear, entryMonth] = entry.fixed_blocks.date.split("-");
        const entryMonthNumber = parseInt(entryMonth, 10);
        const diffYears = parseInt(year, 10) - parseInt(entryYear, 10);
        const diffMonths = monthNumber - entryMonthNumber + (diffYears * 12);
        return diffMonths >= 0 && diffMonths <= 5; // Filter last 6 months
    });
    // Calculate avg cycle length and period duration
    let totalCycleLength = 0;
    let totalPeriodDuration = 0;
    let totalEntries = 0;
    relevantEntries.forEach(entry => {
        const period = entry.fixed_blocks.period;
        if (period === 1) {
            const entryDate = new Date(entry.fixed_blocks.date);
            const previousEntryDate = new Date(entryDate);
            previousEntryDate.setDate(entryDate.getDate() - 1);
            const cycleLength = entryDate.getTime() - previousEntryDate.getTime();
            totalCycleLength += cycleLength;
            totalPeriodDuration++;
        }
        totalEntries++;
    });
    const averageCycleLength = totalPeriodDuration > 0 ? totalCycleLength / totalPeriodDuration : 28 * 24 * 60 * 60 * 1000; // Default to 28 days if no data available
    const averagePeriodDuration = 5 * 24 * 60 * 60 * 1000; // Default to 5 days if no data available
    // Predict period for the current month
    const lastEntry = relevantEntries[relevantEntries.length - 1];
    const lastEntryDate = lastEntry ? new Date(lastEntry.fixed_blocks.date) : new Date(Number(year), monthNumber - 1);
    const predictedPeriodStartDate = new Date(lastEntryDate.getTime() + averageCycleLength);
    const predictedPeriodEndDate = new Date(predictedPeriodStartDate.getTime() + averagePeriodDuration);
    // Set predicted period for the current month
    for (let i = 1; i <= 31; i++) {
        const currentDate = new Date(Number(year), monthNumber - 1, i);
        const isInPredictedPeriod = currentDate >= predictedPeriodStartDate && currentDate <= predictedPeriodEndDate;
        monthData.values[i.toString()] = {
            mood: 0,
            period: isInPredictedPeriod ? 1 : 2
        };
    }
    return monthData;
}
