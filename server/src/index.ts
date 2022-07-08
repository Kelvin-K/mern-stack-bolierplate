import * as dotenv from "dotenv";
import ExpressServer from './expressServer';

dotenv.config();

const port = process.env.PORT || 9000;
const databaseURL = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/my_database";
const redisURL = process.env.REDIS_URL || "redis://localhost:6380";
const redisPassword = process.env.REDIS_PASSWORD || "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81";

new ExpressServer().start(port, databaseURL, redisURL, redisPassword);