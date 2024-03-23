import {saltRounds, User} from "../interfaces/user";
import bcrypt from "bcrypt";
export const users: User[] = [
    {
        username: "admin",
        password: bcrypt.hashSync("pw4admin", saltRounds),
    },
    {
        username: "john",
        password: bcrypt.hashSync("pw4user", saltRounds),
    },
];