import { User } from "../interfaces/user";
import { getUser } from "./user_repo";

// Retrieve period data for the specified user and date(yyyy-mm-dd)
//TODO: algotithmus entwickeln zum berechenen des zyklus
//steps:
// die daten der letzen 4 monate einlesen
// 	(achtung weil es kann jänner sein)
// die daten in einem zyklus[] objekt speichern
// die everage zyklus und perioden daten ausrechnen
// schauen ob die stimmen können
// 	(2-8 tage periode und 25-45 tage zyklus, sonst nehm ich die max/min daten)
// 	(wenn ich keine daten hab/zu wenig hab, nehm ich 5 tage auf 28 tage)
// vom beginn des letzen zyklus, die average dauer an tagen dazurechnen
// die neu erechneten daten dazutuhen
export function getMonthData(username: string, date: string): any {
    const userData: User | undefined = getUser(username);
    const [year, month] = date.split('-');
    var monthData: any = {
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
    /*
    if (userData!.settings.trackPeriod) {
        monthData = calculatePeriodsForThisMonth(monthData,username);
    }
    bitte ignorieren ich brauch das nacher zum aufrufen des WIP perioden aloritmus
     */
    return monthData;
}
function calculatePeriodsForThisMonth(monthData: any,username:string):any{

    return monthData;
}