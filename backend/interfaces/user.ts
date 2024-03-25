import {Week} from "./week";
import {Setting} from "./Setting";
import {Entry} from "./entry";

export const saltRounds = 8;

export interface User {
    username: string;
    password: string;
    entries:Entry[];
    weeks:Week[];
    settings:Setting;
}

export interface UserCredentials {
    username: string;
    password: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}