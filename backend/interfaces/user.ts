export const saltRounds = 8;

export interface User {
    username: string;
    password: string;
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