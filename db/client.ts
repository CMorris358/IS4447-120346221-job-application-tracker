// got from starter assignment code
// changed tasks to applications and name to company
// readded count as realised could be used for want level
// added targets table for weekly and monthly goals
// added categories table for visual tagging
// added users table for login system
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const sqlite = openDatabaseSync("applications.db");
sqlite.execSync(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0
  );
`);

sqlite.execSync(`
  CREATE TABLE IF NOT EXISTS targets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    period TEXT NOT NULL,
    target_count INTEGER NOT NULL
  );
`);

sqlite.execSync(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    colour TEXT NOT NULL
  );
`);

sqlite.execSync(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

export const db = drizzle(sqlite);
