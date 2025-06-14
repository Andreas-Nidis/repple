"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const serverless_1 = require("@neondatabase/serverless");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
// Check if all required environment variables are set
if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
    throw new Error("Missing one or more PostgreSQL environment variables");
}
//Creates a SQL connection using env variables
//This SQL function is used as a tagged template literal >> Allows us to write SQL queries safely
exports.sql = (0, serverless_1.neon)(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`);
