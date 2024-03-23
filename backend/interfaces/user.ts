export const saltRounds = 8;

export interface User {
    username: string;
    password: string;
    fullName: string;
}

export interface UserCredentials {
    username: string;
    password: string;
}

