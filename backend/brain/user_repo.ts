import fs from 'fs';
import {User} from '../interfaces/user';
import {BaseSettings} from "../interfaces/Setting";
import {StatusCodes} from "http-status-codes";
import {ReturnHelper} from "../interfaces/returnHelper";

const USERS_FILE_PATH = './backend/test_data/users.json';
let users :User[]=loadUsersFromFile();

process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    saveUsersToFile();
    process.exit(0);
});
//is username valid3-20 characters
function isUserNameValid(username:string):boolean{
    let res:boolean=true;
    if(username.length<=3||username.length>=20) {
        res = false;
    }
    return res;
}
//is password valid? 8-25 characters
function isPasswordValid(username:string):boolean{
    let res:boolean=true;
    if(username.length<=3||username.length>=25) {
        res = false;
    }
    return res;
}

//TODO: SQL
//changing the name of user, returns tru if succsessfull
export function updateUserByUsername(currentUsername: string, newUsername: string): ReturnHelper {
    const index = users.findIndex(u => u.username === currentUsername);
    if (index == -1) {
        return {response:"User not found",status:StatusCodes.BAD_REQUEST}
    }
    else if(!isUserNameValid(newUsername)){
        return {response:"New Username Not Valid(3-20 characters)",status:StatusCodes.BAD_REQUEST}
    }
    users[index].username = newUsername;
    return {response:"Username Updated Succsessfully",status:StatusCodes.ACCEPTED}
}

//changing the password of a user, returns tru if succsessfull
export function updateUserPassword(username: string, newPw: string, newPasswordHash:string): ReturnHelper {
    const index = users.findIndex(u => u.username === username);
    if (index === -1) {
        return {response:"User not found",status:StatusCodes.BAD_REQUEST}
    }
    else if(!isPasswordValid(newPw)){
        return {response:"New Password not Valid(8-25 characters",status:StatusCodes.BAD_REQUEST}
    }
    users[index].password = newPasswordHash;
    return {response:"Password Updated Succsessfully",status:StatusCodes.ACCEPTED}
}

//deleting a user from db, returns tru if succsessfully
export function deleteUserByUsername(username: string): boolean {
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users.splice(index, 1);
        return true;
    }
    return false;
}

//loading all users from db, user[]
export function loadUsersFromFile(): User[] {
    try {
        const data = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}

//returns users
export function getUser(u:string): User | undefined {
    return users.find(user => user.username === u);
}

//saving a user to data
function saveUsersToFile() {
    try {
        fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
        console.log('Users saved to file.');
    } catch (error) {
        console.error('Error saving users to file:', error);
    }
}

//ading a user to the data
export function addUser(username: string, password: string,hash:string):ReturnHelper {
    if(isPasswordValid(password)){
        if(isUserNameValid(username)){
            users.push(
                {
                    username:username,
                    password:hash,
                    entries:[],
                    weeks:[],
                    settings:BaseSettings
                });
            return {status:StatusCodes.ACCEPTED,response:"Succsessfully Added User"}
        }
        return{status:StatusCodes.BAD_REQUEST,response:"New Username is not Valid (3-20 characters)"}
    }
    return {status:StatusCodes.BAD_REQUEST,response:"New Password is not valid(3-20 characters)"}
}

//updating a user
export function updateUser(u: User): boolean {
    const index = users.findIndex(user => user.username === u.username);
    if (index !== -1) {
        users[index] = u;
        return true;
    }
    return false;
}

//does user exist?
export function doesUserExist(user:string){
    return users.some(u => u.username === user);
}