import fs from 'fs';
import bcrypt from 'bcrypt';
import { saltRounds, User } from '../interfaces/user';

const USERS_FILE_PATH = './backend/test_data/users.json';
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
export function loadUsersFromFile(): User[] {
    try {
        const data = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}
function saveUsersToFile(users: User[]) {
    try {
        fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
        console.log('Users saved to file.');
    } catch (error) {
        console.error('Error saving users to file:', error);
    }
}
export function addUser(username: string, password: string) {
    let users: User[] = loadUsersFromFile();
    users.push({ username, password});
    saveUsersToFile(users);
}