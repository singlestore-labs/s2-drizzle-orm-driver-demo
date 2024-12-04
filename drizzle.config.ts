import { defineConfig } from "drizzle-kit";

import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
	out: './src/drizzle',
	dialect: 'singlestore',
	schema: './src/db/schema.ts',
	dbCredentials: {
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USERNAME || 'root',
		database: process.env.DB_DATABASE || 'test',
		password: process.env.DB_PASSWORD,
		port: Number(process.env.DB_PORT),
		ssl: {
			ca: './ssl/singlestore_bundle.pem',
			rejectUnauthorized: false
		}
	},
})
