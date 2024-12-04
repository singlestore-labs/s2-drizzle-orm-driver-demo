
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/singlestore";
import fs from "fs";
import mysql from "mysql2/promise";
import { usersTable } from "./db/schema";

dotenv.config();

;(async () => {
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: {
      ca: fs.readFileSync('./ssl/singlestore_bundle.pem'),
    }
  });
  
const db = drizzle({ client: connection });

const newUsers = [{
      id: 1,
      name: 'John',
      age: 28,
      email: 'john@example.com'
    },
    {
      id: 2,
      name: 'Jane',
      age: 32,
      email: 'jane@example.com'
    },
    {
      id: 3,
      name: 'Jack',
      age: 25,
      email: 'jack@example.com'
    },
    {
      id: 4,
      name: 'Jill',
      age: 24,
      email: 'jill@example.com'
    },
    {
      id: 5,
      name: 'James',
      age: 30,
      email: 'james@example.com'
    }
]	

//console.log(db)

//await db.insert(usersTable).values(newUsers);

const rows = await db.select().from(usersTable)
console.log(rows)

connection.end()

})()
