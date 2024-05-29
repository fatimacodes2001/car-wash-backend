import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
export const SALT_ROUNDS = 10;
