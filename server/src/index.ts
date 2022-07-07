import * as dotenv from "dotenv";
import ExpressServer from './expressServer';

dotenv.config();

const port = process.env.PORT || 9000;
const databaseUrl = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/my_database";

new ExpressServer().start(port, databaseUrl, "redis://localhost:6379", "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81");