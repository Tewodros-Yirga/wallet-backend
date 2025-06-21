import dotenv from "dotenv";
import express from "express";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

if (process.env.NODE_ENV === "production") job.start();

dotenv.config();
const app = express();
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Ok" });
});

app.use("/api/transactions", transactionsRoute);
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is Up and running on PORT ${PORT}.`);
  });
});
