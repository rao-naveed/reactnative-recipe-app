// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
// import { ENV } from "./env.js";
// import * as schema from "../db/schema.js";

// const sql = neon(ENV.DATABASE_URL);
// export const db = drizzle(sql, { schema });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema.js";

const databaseUrl = process.env.DATABASE_URL;

console.log("DATABASE_URL exists:", !!databaseUrl);

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing in Vercel environment");
}

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
