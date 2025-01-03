import { defineConfig } from "drizzle-kit";

import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_URL) {
	const errorMessage = "Environment variable DB_URL is required\nThe DB_URL should look like: singlestore://user:password@host:port/database\nYou can get the connection string from https://portal.singlestore.com/";
	console.error(errorMessage);
	process.exit(1);
}

export default defineConfig({
	out: './src/drizzle',
	dialect: 'singlestore',
	schema: './src/db/schema.ts',
	dbCredentials: {
		url: process.env.DB_URL,
	},
})
