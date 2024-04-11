import { User } from "../interfaces/user";
import { getUser } from "./user_repo";
import {Entry} from "../interfaces/entry";
import {MenstrualCycle} from "../interfaces/evaluate";

// Retrieve period data for the specified user and date(yyyy-mm-dd)
//TODO: algotithmus entwickeln zum berechenen des zyklus
//steps:
//1. go back from the current date, dont count the current cycle and save the last 4 cycles ( not current one) in a MenstrualClycle[] object
//  (achtung, es kann jänner sein) + die everage zyklus und perioden daten ausrechnen
//2. schauen ob die stimmen können
// 	(2-8 tage periode und 25-45 tage zyklus, sonst nehm ich die max/min daten)
// 	(wenn ich keine daten hab/zu wenig hab, nehm ich 5 tage auf 28 tage)
//3. vom beginn des letzen fertigen zyklus, die average dauer an tagen dazurechnen
//4. die neu erechneten daten dazutuhen
export function getMonthData(username: string, date: string): any {
    const userData: User | undefined = getUser(username);
    const [year, month,day] = date.split('-');
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

    if (userData!.settings.trackPeriod) {
        monthData = calculatePeriodsForThisMonth(monthData,username,year,month,day);
    }
    //bitte ignorieren ich brauch das nacher zum aufrufen des WIP perioden aloritmus
    return monthData;
}

function calculatePeriodsForThisMonth(monthData: any, username: string, year: string, month: string,day:string): any {
    const user = getUser(username);
    const lastFourMonthsData: MenstrualCycle[] = getLastFourMonthsData(username, year, month,day);
    const reasonableData = checkReasonableData(lastFourMonthsData);
    const updatedLastCycle = updateLastCycle(lastFourMonthsData[lastFourMonthsData.length - 1], averageCycleLength);
    addCalculatedDataToMonthData(monthData, updatedLastCycle, reasonableData);
    return monthData;
}
function getLastFourMonthsData(username: string, year: string, month: string,day:string): MenstrualCycle[] {
    const lastFourMonthsData: MenstrualCycle[] = [];
    let currentYear = parseInt(year);
    let currentMonth = parseInt(month);
    let currentday:number=parseInt(day)
    let get_nessesery_data:boolean=false;
    let save_index:number = 130;
    let user_entries=getUser(username)?.entries;
    let lastperioddaybehandelt:string="";
    let tomorrow:string="";
    if(!user_entries){
        return lastFourMonthsData;
    }
    let periodlength=0;
    let i =-1;
    while(!get_nessesery_data&&save_index>0){
        save_index--;
        if(save_index===1){
            console.log(currentYear+"-"+currentMonth+"-"+currentday);
        }
        let helpday=currentday.toString();
        let helpmonth=currentMonth.toString();
        if(currentday.toString().length==1){
            helpday=0+currentday.toString();
        }
        if(currentMonth.toString().length==1){
            helpmonth='0'+currentMonth.toString();
        }
        const targetDate = `${currentYear}-${helpmonth}-${helpday}`;
        if(targetDate==="2023-12-29"){
            console.log("uwu")
        }
        let thisday = user_entries.find(u => u.fixed_blocks.date === targetDate);
        if(thisday){
            if(thisday?.fixed_blocks.period==1){//gerade tag ist periode
                lastperioddaybehandelt=targetDate;
                periodlength++;
            }
            else{//gerade tag ist nicht periode
                if(tomorrow!=""&&lastperioddaybehandelt!=""&&tomorrow==lastperioddaybehandelt){
                    //wenn heute nicht periode und morgen periode, dann morgen start neuer zyklus und heute ende alter zyklus
                    i++;
                    if(lastFourMonthsData.length!=0){//hier setz ich den anfang der vorherigen periode, wenn es eine gab
                        lastFourMonthsData[i-1].startDate=new Date(tomorrow);
                        lastFourMonthsData[i-1].periodLength=periodlength
                    }
                    lastFourMonthsData.push({
                        endDate:new Date(targetDate),
                        startDate:null,
                        periodLength:-1,
                        cycleLength:-1
                    });
                }
                periodlength=0;
            }
        }
        tomorrow=targetDate;
        currentday--;
        if(currentday===0){
            currentMonth--;
            currentday=maxAmountOfDaysInMonth((currentYear+"-"+currentMonth).toString());
        }
        if (currentMonth === 0) {
            currentMonth = 12;
            currentYear--;
            currentday=maxAmountOfDaysInMonth((currentYear+"-"+currentMonth).toString());
        }
    }
    lastFourMonthsData.forEach(lfmd=>{
        lfmd.periodLength=howLong(lfmd.startDate!,lfmd.endDate!);
    });
    if(lastFourMonthsData.length<2){
        return [];
    }
    return lastFourMonthsData;
}
function howLong(startDate: Date, endDate: Date): number {
    const differenceInMs = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
    return days;
}
function maxAmountOfDaysInMonth(date: string): number {
    const [year, month] = date.split('-').map(Number);
    const lastDayOfMonth = new Date(year, month, 0);
    const maxDays = lastDayOfMonth.getDate();
    return maxDays;
}
function checkReasonableData(periodData: number[]): boolean {
    // Placeholder implementation
    return true;
}

function updateLastCycle(lastCycle: MenstrualCycle, averageCycleLength: number): MenstrualCycle {
    // Placeholder implementation
    return lastCycle;
}

function addCalculatedDataToMonthData(monthData: any, updatedLastCycle: MenstrualCycle, reasonableData: boolean): void {
    // Placeholder implementation
}