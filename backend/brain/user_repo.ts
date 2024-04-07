import fs from 'fs';
import { User } from '../interfaces/user';
import {BaseSettings} from "../interfaces/Setting";

const USERS_FILE_PATH = './backend/test_data/users.json';
let users :User[]=loadUsersFromFile();

process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    saveUsersToFile();
    process.exit(0);
});

//changing the name of user, returns tru if succsessfull
//TODO: festlegen ob user name restrictions hat
export function updateUserByUsername(currentUsername: string, newUsername: string): boolean {
    const index = users.findIndex(u => u.username === currentUsername);
    if (index !== -1) {
        users[index].username = newUsername;
        return true;
    }
    return false;
}

//changing the password of a user, returns tru if succsessfull
//TODO: festlegen ob pw restrictions hat
export function updateUserPassword(username: string, newPasswordHash: string): boolean {
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users[index].password = newPasswordHash;
        return true;
    }
    return false;
}

//deleting a user from db, returns tru if succsessfull
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
//TODO festlegen ob es resrtictions für username/pw gibt und festlegen
export function addUser(username: string, password: string) {
    if(!doesUserExist(username)){
        users.push(
            {
                username:username,
                password:password,
                entries:[],
                weeks:[],
                settings:BaseSettings
            });
    }
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