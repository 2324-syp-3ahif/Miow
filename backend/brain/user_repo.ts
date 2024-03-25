import fs from 'fs';
import bcrypt from 'bcrypt';
import { saltRounds, User } from '../interfaces/user';
import {BaseSettings} from "../interfaces/Setting";

const USERS_FILE_PATH = './backend/test_data/users.json';

//changing the password of user, returns tru if succsessfull
export function updateUserByUsername(currentUsername: string, newUsername: string): boolean {
    let users: User[] = loadUsersFromFile();
    const index = users.findIndex(u => u.username === currentUsername);
    if (index !== -1) {
        users[index].username = newUsername;
        saveUsersToFile(users);
        return true;
    }
    return false;
}

//changing the password of a user, returns tru if succsessfull
export function updateUserPassword(username: string, newPasswordHash: string): boolean {
    let users: User[] = loadUsersFromFile();
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users[index].password = newPasswordHash;
        saveUsersToFile(users);
        return true;
    }
    return false;
}

//deleting a user from db, returns tru if succsessfull
export function deleteUserByUsername(username: string): boolean {
    let users: User[] = loadUsersFromFile();
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users.splice(index, 1);
        saveUsersToFile(users);
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

//saving a user to data
function saveUsersToFile(users: User[]) {
    try {
        fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
        console.log('Users saved to file.');
    } catch (error) {
        console.error('Error saving users to file:', error);
    }
}

//ading a user to the data
export function addUser(username: string, password: string) {
    let users: User[] = loadUsersFromFile();
    users.push(
        {
            username:username,
            password:password,
            entries:[],
            weeks:[],
            settings:BaseSettings
        });
    saveUsersToFile(users);
}