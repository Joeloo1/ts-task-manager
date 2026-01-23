import app from "./app";
import { connectDB } from "./Config/database";
import config from "./Config/config.env";
import logger from "./Config/winston";
import { taskReminderJob } from "./Config/cron/taskReminder.cron";

const port = config.PORT;

connectDB();
app.listen(port, () => {
  logger.info(`App running on port: ${port}...`);
});
taskReminderJob.start();
