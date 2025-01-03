import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/singlestore";
import { NextResponse } from "next/server";

const DB_URL = process.env.DB_URL || '';
if (!DB_URL) {
	const errorMessage = "Environment variable DB_URL is required\nThe DB_URL should look like: singlestore://user:password@host:port/database\nYou can get the connection string from https://portal.singlestore.com/";
	console.error(errorMessage);
  process.exit(1);
}

export async function GET() {
  const db = drizzle(DB_URL);
  
  try {
    const users = await db.select().from(usersTable);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch users: ${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const db = drizzle(DB_URL);
  
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
      
    return NextResponse.json({ 
      message: "User created",
      user: createdUser
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed to create user: ${error}`}, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const db = drizzle(DB_URL);
  
  try {
    const data = await request.json();
    const updatedUser = {
      ...data,
      lastUpdated: new Date(),
    };
    await db.update(usersTable)
      .set(updatedUser)
      .where(eq(usersTable.id, updatedUser.id));
    return NextResponse.json({ message: "User updated" });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: `Failed to update user: ${error}`}, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const db = drizzle(DB_URL);
  
  try {
    const { id } = await request.json();
    await db.delete(usersTable)
      .where(eq(usersTable.id, id));
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: `Failed to delete user: ${error}`}, { status: 500 });
  }
} 
