import dotenv from "dotenv";

import app from "./app";

dotenv.config();

const port = Number(process.env.PORT);

app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
