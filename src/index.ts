import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import reportRoutes from "./routes/reportRoutes";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

// Use user routes for user-related endpoints
app.use("/users", userRoutes);

// Use report routes for report-related endpoints
app.use("/", reportRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
