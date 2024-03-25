import {BaseEntry, Entry} from "./entry";
import {aboutUs, privacyPolicy, termsOfService} from "../brain/setting_repo";

export interface Setting{
    themeNR:number;
    entrySettings:Entry;
    aboutUs:string;
    termsOfService:string;
    privacyPolicy:string;
    trackPeriod:boolean;
}
export let BaseSettings :Setting = {
    aboutUs: aboutUs,
    entrySettings: BaseEntry,
    privacyPolicy: privacyPolicy,
    termsOfService: termsOfService,
    themeNR: 1,
    trackPeriod: true
}