import {saltRounds, User} from "../interfaces/user";
import bcrypt from "bcrypt";
export const users: User[] = [
    {
        fullname: "Administrator",
        username: "admin@fruits.at",
        role: "admin",
        password: bcrypt.hashSync("pw4admin", saltRounds),
    },
    {
        fullname: "John Doe",
        username: "john@doe.at",
        role: "user",
        password: bcrypt.hashSync("pw4user", saltRounds),
    },
];

