import * as dotenv from "dotenv";
import ExpressServer from './expressServer';

dotenv.config();
new ExpressServer().start(process.env.PORT || 9000);