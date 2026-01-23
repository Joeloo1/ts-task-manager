import cron from "node-cron";
import { prisma } from "../database";
import sendMail from "../../utils/email";
import logger from "../winston";

export const taskReminderJob = cron.schedule(
  "0 * * * *", // every hour
  async () => {
    logger.info("⏰ Cron job running...");
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: now,
          lte: next24Hours,
        },
        status: "TODO",
        reminderSent: false,
      },
      include: {
        author: true,
      },
    });

    logger.info(`Found ${tasks.length} tasks needing reminders`);

    for (const task of tasks) {
      try {
        await sendMail({
          from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
          to: task.author.email,
          subject: "⏰ Task Reminder",
          html: `
      <h3>Task Due Soon</h3>
      <p><b>Task Name:</b> ${task.title}</p>
      <p><b>Description:</b> ${task.description || "No description"}</p>
      <p>Due: ${task.dueDate?.toLocaleString()}</p>
    `,
        });

        logger.info(`Reminder sent for task: ${task.title}`);

        await prisma.task.update({
          where: { id: task.id },
          data: { reminderSent: true },
        });
      } catch (error) {
        logger.error(
          `❌ Failed to process reminder for task ${task.id}:`,
          error,
        );
        continue;
      }
    }
  },
  {
    scheduled: false,
  } as any,
);
