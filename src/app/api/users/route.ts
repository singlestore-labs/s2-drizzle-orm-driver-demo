import { drizzle } from "drizzle-orm/singlestore";
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { usersTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import fs from "fs";

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: {
      ca: fs.readFileSync('./src/ssl/singlestore_bundle.pem'),
    }
  });
}

export async function GET() {
  const connection = await getConnection();
  const db = drizzle(connection);
  
  try {
    const users = await db.select().from(usersTable);
    await connection.end();
    return NextResponse.json(users);
  } catch (error) {
    await connection.end();
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const connection = await getConnection();
  const db = drizzle(connection);
  
  try {
    const data = await request.json();
    const newUser = {
      ...data,
      name: `${data.name}`,
      lastUpdated: new Date(),
    };
    
    // Insert the new user
    await db.insert(usersTable).values(newUser);
    
    // Fetch the newly created user using the unique name
    const [createdUser] = await db.select()
      .from(usersTable)
      .where(eq(usersTable.name, newUser.name))
      .limit(1);
      
    await connection.end();
    return NextResponse.json({ 
      message: "User created",
      user: createdUser
    });
  } catch (error) {
    await connection.end();
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const connection = await getConnection();
  const db = drizzle(connection);
  
  try {
    const data = await request.json();
    const updatedUser = {
      ...data,
      lastUpdated: new Date(),
    };
    await db.update(usersTable)
      .set(updatedUser)
      .where(eq(usersTable.id, updatedUser.id));
    await connection.end();
    return NextResponse.json({ message: "User updated" });
  } catch (error) {
    console.error('Update error:', error);
    await connection.end();
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const connection = await getConnection();
  const db = drizzle(connection);
  
  try {
    const { id } = await request.json();
    await db.delete(usersTable)
      .where(eq(usersTable.id, id));
    await connection.end();
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error('Delete error:', error);
    await connection.end();
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
} 