import express from "express";
import axios from "axios";
import { verifyToken } from "../middleware/auth.js";
import { AppError } from "../utils/errorHandler.js";

const router = express.Router();

const getCoolifyClient = () => {
  const baseURL = process.env.COOLIFY_BASE_URL;
  const token = process.env.COOLIFY_TOKEN;

  if (!baseURL || !token) {
    throw new AppError("Coolify configuration not found", 500);
  }

  return axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

router.use(verifyToken);

router.get("/applications", async (req, res, next) => {
  try {
    const coolify = getCoolifyClient();
    const response = await coolify.get("/applications");
    res.json(response.data);
  } catch (error) {
    next(
      new AppError(
        error.response?.data?.message || "Failed to fetch applications",
        error.response?.status || 500
      )
    );
  }
});

router.get("/services", async (req, res, next) => {
  try {
    const coolify = getCoolifyClient();
    const response = await coolify.get("/services");
    res.json(response.data);
  } catch (error) {
    next(
      new AppError(
        error.response?.data?.message || "Failed to fetch services",
        error.response?.status || 500
      )
    );
  }
});

router.get("/databases", async (req, res, next) => {
  try {
    const coolify = getCoolifyClient();
    const response = await coolify.get("/databases");
    res.json(response.data);
  } catch (error) {
    next(
      new AppError(
        error.response?.data?.message || "Failed to fetch databases",
        error.response?.status || 500
      )
    );
  }
});

export default router;
