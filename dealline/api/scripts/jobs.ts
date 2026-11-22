// Daily job. Schedule once a day (e.g. 03:00 Asia/Riyadh) with your host's cron. Usage: npm run jobs
import { pgDb } from "../src/db.js";
import { runOffplanJobs } from "../src/offplan.js";
import { emitDueSoon } from "../src/automation.js";

const db = pgDb(process.env.DATABASE_URL!);
console.info(JSON.stringify({ ...(await runOffplanJobs(db)), ...(await emitDueSoon(db)) }));
process.exit(0);
