import * as sqlite from "sqlite";
import {open} from "sqlite";
import sqlite3 from "sqlite3";


export async function keineahnung(){
    let db = await open({
        filename: './backend/database.db',
        driver: sqlite3.Database
    });
}

