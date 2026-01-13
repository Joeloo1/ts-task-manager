import dotenv from "dotenv";

import app from "./app";
import { connectDB } from "./Config/dotabase";

dotenv.config();

const port = Number(process.env.PORT);

connectDB();
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
