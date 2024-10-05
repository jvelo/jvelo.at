import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
} = process.env;

const sql = postgres("postgres://jvelo:@localhost:5432/jvelo", {
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
});

export default sql;
