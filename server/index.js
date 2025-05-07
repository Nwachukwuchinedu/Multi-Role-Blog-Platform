// backend/app.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Serve static uploads folder
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
