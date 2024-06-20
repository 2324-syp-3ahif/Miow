import {BaseEntry, Entry} from "./entry";

export interface Setting{
    themeNR:number;
    trackPeriod:boolean;
}
export let BaseSettings :Setting = {
    themeNR: 1,//1-6
    trackPeriod: true
}