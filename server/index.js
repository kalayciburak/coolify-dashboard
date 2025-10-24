import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import coolifyRoutes from "./routes/coolify.js";
import { corsMiddleware } from "./middleware/cors.js";
import { handleError } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(corsMiddleware);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/coolify", coolifyRoutes);

app.get("/healthz", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    ...(NODE_ENV !== "production" && { environment: NODE_ENV }),
  });
});

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.use((err, req, res, _next) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  if (NODE_ENV !== "production") {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  }
});
