import fs from 'fs';
import { User } from '../interfaces/user';
import {BaseSettings} from "../interfaces/Setting";

const USERS_FILE_PATH = './backend/test_data/users.json';
let users :User[]=loadUsersFromFile();
//changing the password of user, returns tru if succsessfull
export function updateUserByUsername(currentUsername: string, newUsername: string): boolean {
    const index = users.findIndex(u => u.username === currentUsername);
    if (index !== -1) {
        users[index].username = newUsername;
        saveUsersToFile();
        return true;
    }
    return false;
}

//changing the password of a user, returns tru if succsessfull
export function updateUserPassword(username: string, newPasswordHash: string): boolean {
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users[index].password = newPasswordHash;
        saveUsersToFile();
        return true;
    }
    return false;
}

//deleting a user from db, returns tru if succsessfull
export function deleteUserByUsername(username: string): boolean {
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users.splice(index, 1);
        saveUsersToFile();
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
export function getUser(u:string){
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
export function addUser(username: string, password: string) {
    users.push(
        {
            username:username,
            password:password,
            entries:[],
            weeks:[],
            settings:BaseSettings
        });
    saveUsersToFile();
}

//updating a user
export function updateUser(u: User): boolean {
    const index = users.findIndex(user => user.username === u.username);
    if (index !== -1) {
        users[index] = u;
        saveUsersToFile();
        return true;
    }
    return false;
}

//does user exist?
export function doesUserExist(user:string){
    return users.find(u => u.username === user);
}