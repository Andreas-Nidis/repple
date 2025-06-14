import { neon } from "@neondatabase/serverless";
import dotenv from 'dotenv';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Check if all required environment variables are set
if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error("Missing one or more PostgreSQL environment variables");
}

//Creates a SQL connection using env variables
//This SQL function is used as a tagged template literal >> Allows us to write SQL queries safely
export const sql = neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`)