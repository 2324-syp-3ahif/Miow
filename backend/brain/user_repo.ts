import fs from 'fs';
import bcrypt from 'bcrypt';
import { saltRounds, User } from '../interfaces/user';

const USERS_FILE_PATH = './backend/test_data/users.json';

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