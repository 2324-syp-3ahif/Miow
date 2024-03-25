import {BaseEntry, Entry} from "./entry";

export interface Setting{
    themeNR:number;
    entrySettings:Entry;
    aboutUs:string;
    termsOfService:string;
    privacyPolicy:string;
    trackPeriod:boolean;
}
export let BaseSettings :Setting = {
    aboutUs: "",
    entrySettings: BaseEntry,
    privacyPolicy: "Privacy is Important...",
    termsOfService: "AGBS...",
    themeNR: 1,
    trackPeriod: true
}