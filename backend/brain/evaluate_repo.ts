import {User} from "../interfaces/user";
import {getUser} from "./user_repo";
import {CalcCycle, MenstrualCycle} from "../interfaces/evaluate";
// Retrieve month data for the specified user and date(yyyy-mm-dd)
export function getMonthData(username: string, date: string) {
    const userData: User | undefined = getUser(username);
    if (!userData) return null;
    const [year, month, day] = date.split('-');


    var monthData: any;
    if(userData!.settings.trackPeriod){
        monthData= {
            Message:"Ok",
            Date: `${year}-${month}`,
            values: new Array(maxAmountOfDaysInMonth(year+"-"+month)).map((_, index) => ({
                day: (index + 1).toString().padStart(2, '0'),
                mood: 0,
                period: 2
            }))
        };
    }
    else{
        monthData= {
            Message:"Ok",
            Date: `${year}-${month}`,
            values: new Array(maxAmountOfDaysInMonth(year+"-"+month)).map((_, index) => ({
                day: (index + 1).toString().padStart(2, '0'),
                mood: 0,
                period: 0
            }))
        };
    }




    for (const entry of userData!.entries) {
        const entryDate = entry.fixed_blocks.date;
        const [entryYear, entryMonth] = entryDate.split('-');
        if (entryYear === year && entryMonth === month) {
            const entryDay = parseInt(entryDate.split('-')[2]);
            monthData.values[entryDay-1].mood=entry.fixed_blocks.mood;
            monthData.values[entryDay-1].period=entry.fixed_blocks.period
        }
    }


    return userData.settings.trackPeriod && new Date(Date.now()) < new Date(date) ? calculatePeriodsForThisMonth(monthData, username, year, month, day): monthData;
}
//steps(teile und herrsche!!!~die griechen):
//1. go back from the current date, dont count the current cycle and save the last 6 or so cycles ( not current one) in a MenstrualClycle[] object
//  (achtung, es kann jänner sein) + die everage zyklus und perioden daten ausrechnen
//2. schauen ob die stimmen können
// 	(genug datensätze,2-8 tage periode und 25-45 tage zyklus, sonst nehm ich die max/min daten)
// 	(wenn ich keine daten hab/zu wenig hab, nehm ich 5 tage auf 28 tage)
//3. vom beginn des letzen fertigen zyklus, die average dauer an tagen dazurechnen(ich liebe arrays)
//4. die neu erechneten daten dazutuhen
//this is the controller function that coordinates the period calculation
function calculatePeriodsForThisMonth(monthData: any, username: string, year: string, month: string, day: string): any {
    const lastFourMonthsData: MenstrualCycle[] = getLastFiveMonthsData(username, year, month, day);
    if (lastFourMonthsData.length > 0) {
        const reasonableData = checkReasonableData(lastFourMonthsData);
        const calculatedCycle = calcNextCycle(lastFourMonthsData[0], reasonableData);
        addCalculatedDataToMonthData(monthData, calculatedCycle, year + "-" + month + "-" + day);
        monthData.Message = reasonableData.Message;
    }
    return monthData;
}
//retieves the last 150days of data
function getLastFiveMonthsData(username: string, year: string, month: string, day: string): MenstrualCycle[] {
    const lastFourMonthsData: MenstrualCycle[] = [];
    let currentYear = parseInt(year);
    let currentMonth = parseInt(month);
    let currentday: number = parseInt(day);
    let user_entries = getUser(username)?.entries;
    let lastperioddaybehandelt: string = "";
    let tomorrow: string = "";
    if (!user_entries) {
        return lastFourMonthsData;
    }
    let cyclelength = 0;
    let i = -1;
    for (let j = 150; j >0; j--) {
        let helpday = currentday.toString().length !== 1 ? currentday.toString() : 0 + currentday.toString();
        let helpmonth = currentMonth.toString().length !== 1 ? currentMonth.toString():'0'+currentMonth;
        const targetDate = `${currentYear}-${helpmonth}-${helpday}`;
        let thisday = user_entries.find(u => u.fixed_blocks.date === targetDate);
        if (thisday) {
            cyclelength++;
            if (thisday?.fixed_blocks.period == 1) {//gerade tag ist periode
                lastperioddaybehandelt = targetDate;
            } else {//gerade tag ist nicht periode
                if (tomorrow != "" && lastperioddaybehandelt != "" && tomorrow == lastperioddaybehandelt) {
                    //wenn heute nicht periode und morgen periode, dann morgen start neuer zyklus und heute ende alter zyklus
                    i++;
                    if (lastFourMonthsData.length != 0) {//hier setz ich den anfang der vorherigen periode, wenn es eine gab
                        lastFourMonthsData[i - 1].startDate = new Date(tomorrow);
                        lastFourMonthsData[i - 1].periodLength = cyclelength - 1;
                    }
                    lastFourMonthsData.push({
                        endDate: new Date(targetDate),
                        startDate: null,
                        periodLength: -1,
                        cycleLength: -1
                    });
                }
                cyclelength = 0;
            }
        }
        tomorrow = targetDate;
        currentday--;
        if (currentday === 0) {
            currentMonth--;
            currentday = maxAmountOfDaysInMonth((currentYear + "-" + currentMonth).toString());
        }
        if (currentMonth === 0) {
            currentMonth = 12;
            currentYear--;
            currentday = maxAmountOfDaysInMonth((currentYear + "-" + currentMonth).toString());
        }
    }
    lastFourMonthsData.pop();
    lastFourMonthsData.forEach(lfmd => {lfmd.cycleLength = howLong(lfmd.startDate!, lfmd.endDate!);});
    return lastFourMonthsData;
}
//schaut die avg daten an und schaut ob die ok sind
function checkReasonableData(periodData: MenstrualCycle[]): CalcCycle {
    if (periodData.length === 0) return {PeriodLength: 5, CycleLength: 28, Message: "periodData is null?"};
    let allPeriodLengths = 0;
    let allCycleLengths = 0;
    periodData.forEach(pd => {
        allPeriodLengths += pd.periodLength;
        allCycleLengths += pd.cycleLength;
    });
    let avgPeriodLength = allPeriodLengths / periodData.length;
    let avgCycleLength = allCycleLengths / periodData.length;
    return {PeriodLength: avgPeriodLength, CycleLength: avgCycleLength, Message: ((avgPeriodLength < 3 ? "Period is very short" : avgPeriodLength > 7 ? "Period is very long" : "") + (avgCycleLength > 25 ? "Cycle is very short" : avgCycleLength < 40 ? "Cycle is very long" : "") || "All OK"),};
}
//i forgot what dis was fore lol
function calcNextCycle(lastFullCycle: MenstrualCycle, averageCycleLength: CalcCycle): MenstrualCycle [] {
    let m: MenstrualCycle[] = [];
    for (let i = 0; i < 5; i++) {
        let newCycle = {
            cycleLength: averageCycleLength.CycleLength,
            periodLength: averageCycleLength.PeriodLength,
            startDate: addDays(lastFullCycle.endDate!, 1),
            endDate: addDays(lastFullCycle.endDate!, averageCycleLength.CycleLength)
        };
        m.push(newCycle);
        lastFullCycle = newCycle;
    }
    return m;
}
//this just adds the calculated cycles to this months data
function addCalculatedDataToMonthData(monthData: any, updatedLastCycle: MenstrualCycle[], date: string): void {
    const [year, month] = date.split('-');// Extracting the current date
    const montnstartday = new Date(year + "-" + month + "-" + "01");
    const monthendday = new Date(year + "-" + month + "-" + maxAmountOfDaysInMonth(date));
    const currentDate = new Date(date); //new Date(Date.now()); //in real usage, use the current date
    // Iterate through each menstrual cycle in the updatedLastCycle array
    for (const cycle of updatedLastCycle) {
        if (!cycle.startDate || !cycle.endDate) continue;
        const cycleStartDate = new Date(cycle.startDate)
        const cycleEndDate =  new Date(cycle.endDate);
        // If the cycle's end date is before the current date or its start date is after the current month's end date, skip it
        if (cycleEndDate < currentDate || cycleStartDate > new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)) continue;
        const dayswhereperiod: Date[] = [];
        for (let i = 0; i < cycle.periodLength; i++) {
            const dayToAdd: Date = new Date(cycleStartDate);
            dayToAdd.setDate(cycleStartDate.getDate() + i);
            dayswhereperiod.push(dayToAdd);
        }
        //aussortiren, welche tage im relevanten monat sind
        const dayswhereperiodinmonth = [];
        for (let i = 0; i < dayswhereperiod.length; i++) {
            if (dayswhereperiod[i] >= montnstartday && dayswhereperiod[i] <= monthendday) {
                dayswhereperiodinmonth.push(dayswhereperiod[i]);
            }
        }
        //save in monthData every day thats under dayswhereperiodmonth period=3
        for (const day of dayswhereperiodinmonth) {
            const dayNumber = (day.getDate() - 1).toString();
            if (!monthData.values[dayNumber]) {
                monthData.values[dayNumber].period = 3;
            } else {
                monthData.values[dayNumber].period = 3;
            }
        }
    }
}
//Hilsffuntkionen:
function howLong(startDate: Date, endDate: Date): number {
    const differenceInMs = endDate.getTime() - startDate.getTime();
    return Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
}

function maxAmountOfDaysInMonth(date: string): number {
    const [year, month] = date.split('-').map(Number);
    return new Date(year, month, 0).getDate();
}

function addDays(date: Date, days: number): Date {
    return new Date(date.getDate() + days);
}

//ich hasse ts das is so dumm :(
function padValue(value:any) {
    return (value < 10) ? "0" + value : value;
}