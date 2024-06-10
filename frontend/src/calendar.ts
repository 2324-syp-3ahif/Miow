/*
* Nothing works bro
*
* import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const WEEKDAYS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY: string = dayjs().format("YYYY-MM-DD");

const INITIAL_YEAR: string = dayjs().format("YYYY");
const INITIAL_MONTH: string = dayjs().format("M");

let selectedMonth: dayjs.Dayjs = dayjs(new Date(Number(INITIAL_YEAR), Number(INITIAL_MONTH) - 1, 1));
let currentMonthDays: any[];
let previousMonthDays: any[];
let nextMonthDays: any[];

const daysOfWeekElement: HTMLElement | null = document.getElementById("days-of-week");

WEEKDAYS.forEach((weekday: string) => {
    const weekDayElement: HTMLElement = document.createElement("li");
    daysOfWeekElement?.appendChild(weekDayElement);
    weekDayElement.innerText = weekday;
});

createCalendar();
initMonthSelectors();

function createCalendar(year: string = INITIAL_YEAR, month: string = INITIAL_MONTH): void {
    const calendarDaysElement: HTMLElement | null = document.getElementById("calendar-days");

    document.getElementById("selected-month")!.innerText = dayjs(
        new Date(Number(year), Number(month) - 1)
    ).format("MMMM YYYY");

    removeAllDayElements(calendarDaysElement);

    currentMonthDays = createDaysForCurrentMonth(
        year,
        month,

    );

    previousMonthDays = createDaysForPreviousMonth(year, month);

    nextMonthDays = createDaysForNextMonth(year, month);

    const days: any[] = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

    days.forEach((day: any) => {
        appendDay(day, calendarDaysElement);
    });
}

function appendDay(day: any, calendarDaysElement: HTMLElement | null): void {
    const dayElement: HTMLElement = document.createElement("li");
    const dayElementClassList: DOMTokenList = dayElement.classList;
    dayElementClassList.add("calendar-day");
    const dayOfMonthElement: HTMLElement = document.createElement("span");
    dayOfMonthElement.innerText = day.dayOfMonth.toString();
    dayElement.appendChild(dayOfMonthElement);
    calendarDaysElement?.appendChild(dayElement);

    if (!day.isCurrentMonth) {
        dayElementClassList.add("calendar-day--not-current");
    }

    if (day.date === TODAY) {
        dayElementClassList.add("calendar-day--today");
    }
}

function removeAllDayElements(calendarDaysElement: HTMLElement | null): void {
    let first: ChildNode | null = calendarDaysElement?.firstElementChild;

    while (first) {
        first.remove();
        first = calendarDaysElement?.firstElementChild;
    }
}

function getNumberOfDaysInMonth(year: string, month: string): number {
    return dayjs(`${year}-${month}-01`).daysInMonth();
}

function createDaysForCurrentMonth(year: string, month: string): any[] {
    return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
        return {
            date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
            dayOfMonth: index + 1,
            isCurrentMonth: true
        };
    });
}

function createDaysForPreviousMonth(year: string, month: string): any[] {
    const firstDayOfTheMonthWeekday: number = getWeekday(currentMonthDays[0].date);

    const previousMonth: dayjs.Dayjs = dayjs(`${year}-${month}-01`).subtract(1, "month");

    const visibleNumberOfDaysFromPreviousMonth: number = firstDayOfTheMonthWeekday
        ? firstDayOfTheMonthWeekday - 1
        : 6;

    const previousMonthLastMondayDayOfMonth: number = dayjs(currentMonthDays[0].date)
        .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
        .date();

    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
        return {
            date: dayjs(
                `${previousMonth.year()}-${previousMonth.month() + 1}-${
                    previousMonthLastMondayDayOfMonth + index
                }`
            ).format("YYYY-MM-DD"),
            dayOfMonth: previousMonthLastMondayDayOfMonth + index,
            isCurrentMonth: false
        };
    });
}

function createDaysForNextMonth(year: string, month: string): any[] {
    const lastDayOfTheMonthWeekday: number = getWeekday(
        `${year}-${month}-${currentMonthDays.length}`
    );

    const nextMonth: dayjs.Dayjs = dayjs(`${year}-${month}-01`).add(1, "month");

    const visibleNumberOfDaysFromNextMonth: number = lastDayOfTheMonthWeekday
        ? 7 - lastDayOfTheMonthWeekday
        : lastDayOfTheMonthWeekday;

    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
        return {
            date: dayjs(
                `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
            ).format("YYYY-MM-DD"),
            dayOfMonth: index + 1,
            isCurrentMonth: false
        };
    });
}

function getWeekday(date: string): number {
    return dayjs(date).weekday();
}

function initMonthSelectors(): void {
    document
        .getElementById("previous-month-selector")!
        .addEventListener("click", function () {
            selectedMonth = dayjs(selectedMonth).subtract(1, "month");
            createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
        });

    document
        .getElementById("present-month-selector")!
        .addEventListener("click", function () {
            selectedMonth = dayjs(new Date(Number(INITIAL_YEAR), Number(INITIAL_MONTH) - 1, 1));
            createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
        });

    document
        .getElementById("next-month-selector")!
        .addEventListener("click", function () {
            selectedMonth = dayjs(selectedMonth).add(1, "month");
            createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
        });
}
*
* */