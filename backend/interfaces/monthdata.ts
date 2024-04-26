export interface MonthData {
    Message: string,
    Date: string,
    values: DayData[]
}

export interface DayData {
    day: string,
    mood: number,
    period: number
}
