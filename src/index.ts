
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/singlestore";
import fs from "fs";
import mysql from "mysql2/promise";
import { usersTable } from "./db/schema";

dotenv.config();

const newUsers = [{
    name: 'John',
    age: 28,
    email: 'john@example.com'
  },
  {
    name: 'Jane',
    age: 32,
    email: 'jane@example.com'
  },
  {
    name: 'Jack',
    age: 25,
    email: 'jack@example.com'
  },
  {
    name: 'Jill',
    age: 24,
    email: 'jill@example.com'
  },
  {
    name: 'James',
    age: 30,
    email: 'james@example.com'
  }
]	

;(async () => {
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: {
      ca: fs.readFileSync('./src/ssl/singlestore_bundle.pem'),
    }
  });
  
const db = drizzle({ client: connection });

// Insert new users
await db.insert(usersTable).values(newUsers);

// Fetch all users
const rows = await db.select().from(usersTable)

// Print all users
console.log(rows)

// Close the connection
connection.end()

})()
