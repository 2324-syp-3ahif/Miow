import { User } from "../interfaces/user";
import { getUser } from "./user_repo";
import {CalcCycle, MenstrualCycle} from "../interfaces/evaluate";

// Retrieve period data for the specified user and date(yyyy-mm-dd)
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
//TODO: algotithmus entwickeln zum berechenen des zyklus
//steps(teile und herrsche!!!~die griechen):
//1. go back from the current date, dont count the current cycle and save the last 4 cycles ( not current one) in a MenstrualClycle[] object
//  (achtung, es kann jänner sein) + die everage zyklus und perioden daten ausrechnen
//2. schauen ob die stimmen können
// 	(genug datensätze,2-8 tage periode und 25-45 tage zyklus, sonst nehm ich die max/min daten)
// 	(wenn ich keine daten hab/zu wenig hab, nehm ich 5 tage auf 28 tage)
//3. vom beginn des letzen fertigen zyklus, die average dauer an tagen dazurechnen
//4. die neu erechneten daten dazutuhen
function calculatePeriodsForThisMonth(monthData: any, username: string, year: string, month: string,day:string): any {
    /*step 1:*/const lastFourMonthsData: MenstrualCycle[] = getLastFourMonthsData(username, year, month,day);
    /*step 2:*/const reasonableData = checkReasonableData(lastFourMonthsData);
    /*step 3:*/const calculateNextCycle = calcNextCycle(lastFourMonthsData[0], reasonableData);
    /*step 4:*///addCalculatedDataToMonthData(monthData, updatedLastCycle, reasonableData);
    return monthData;
}
function getLastFourMonthsData(username: string, year: string, month: string,day:string): MenstrualCycle[] {
    const lastFourMonthsData: MenstrualCycle[] = [];
    let currentYear = parseInt(year);
    let currentMonth = parseInt(month);
    let currentday:number=parseInt(day);
    let save_index:number = 130;
    let user_entries=getUser(username)?.entries;
    let lastperioddaybehandelt:string="";
    let tomorrow:string="";
    if(!user_entries){
        return lastFourMonthsData;
    }
    let periodlength=0;
    let i =-1;
    while(save_index>0){
        save_index--;
        let helpday=currentday.toString();
        let helpmonth=currentMonth.toString();
        if(currentday.toString().length==1){
            helpday=0+currentday.toString();
        }
        if(currentMonth.toString().length==1){
            helpmonth='0'+currentMonth.toString();
        }
        const targetDate = `${currentYear}-${helpmonth}-${helpday}`;
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
    lastFourMonthsData.pop();
    lastFourMonthsData.forEach(lfmd=>{
        lfmd.periodLength=howLong(lfmd.startDate!,lfmd.endDate!);
    });
    return lastFourMonthsData;
}

function checkReasonableData(periodData: MenstrualCycle[]):CalcCycle{
    if (periodData.length === 0) return { PeriodLength: 5, CycleLength: 28 };
    let allPeriodLengths=0;
    let allCycleLengths=0;
    periodData.forEach(pd=>{
        allPeriodLengths+=pd.periodLength;
        allCycleLengths+=pd.cycleLength;
    });
    let avgPeriodLength=allPeriodLengths/periodData.length;
    let avgCycleLength=allCycleLengths/periodData.length;
    const calcPeriodLength = (avgPeriodLength >= 3 && avgPeriodLength <= 7) ? avgPeriodLength : 5;
    const calcCycleLength = (avgCycleLength >= 25 && avgCycleLength <= 50) ? avgCycleLength : 28;
    return {PeriodLength:calcPeriodLength,CycleLength:calcCycleLength};
}

function calcNextCycle(lastfullCycle: MenstrualCycle, averageCycleLength: CalcCycle): MenstrualCycle {
    return {
        cycleLength: averageCycleLength.CycleLength,
        periodLength: averageCycleLength.PeriodLength,
        startDate:new Date(lastfullCycle.endDate!.getDate()+1),
        endDate:new Date(lastfullCycle.endDate!.getDate()+averageCycleLength.CycleLength,
        )};
}

function addCalculatedDataToMonthData(monthData: any, updatedLastCycle: MenstrualCycle, reasonableData: boolean): void {
    // Placeholder implementation
}

//Hilsffuntkionen:
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