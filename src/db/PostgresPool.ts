import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// @ts-ignore
export default function query(queryText, values?) {
  return pool.query(queryText, values);
}
