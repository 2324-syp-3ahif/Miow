import {BaseEntry, Entry} from "./entry";

export interface Setting{
    themeNR:number;
    entrySettings:Entry;
    trackPeriod:boolean;
}
export let BaseSettings :Setting = {
    entrySettings: BaseEntry,
    themeNR: 1,
    trackPeriod: true
}