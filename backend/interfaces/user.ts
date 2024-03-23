export const saltRounds = 8;

export interface User {
    username: string;
    fullname: string;
    password: string;
}

export interface UserCredentials {
    email: string;
    password: string;
}

