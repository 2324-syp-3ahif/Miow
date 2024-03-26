import {BaseEntry, Entry} from "./entry";
import {aboutUs, privacyPolicy, termsOfService} from "../brain/setting_repo";

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