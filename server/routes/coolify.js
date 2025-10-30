import express from "express";
import axios from "axios";
import { verifyToken, verifyTokenForSSE } from "../middleware/auth.js";
import { checkAdminPermission } from "../middleware/adminCheck.js";
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

router.get("/applications", verifyToken, async (req, res, next) => {
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

router.get("/services", verifyToken, async (req, res, next) => {
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

router.get("/databases", verifyToken, async (req, res, next) => {
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

router.get("/user-type", verifyToken, async (req, res) => {
  const userType = process.env.DASHBOARD_USER_TYPE || "viewer";
  res.json({ userType: userType.toLowerCase() });
});

router.post(
  "/services/:uuid/start",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.post(`/services/${uuid}/start`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to start service",
          error.response?.status || 500
        )
      );
    }
  }
);

router.post(
  "/services/:uuid/stop",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.post(`/services/${uuid}/stop`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to stop service",
          error.response?.status || 500
        )
      );
    }
  }
);

router.post(
  "/services/:uuid/restart",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.post(`/services/${uuid}/restart`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to restart service",
          error.response?.status || 500
        )
      );
    }
  }
);

router.delete(
  "/services/:uuid",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.delete(`/services/${uuid}`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to delete service",
          error.response?.status || 500
        )
      );
    }
  }
);


router.post(
  "/applications/:uuid/start",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.post(`/applications/${uuid}/start`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to start application",
          error.response?.status || 500
        )
      );
    }
  }
);

router.post(
  "/applications/:uuid/stop",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.post(`/applications/${uuid}/stop`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to stop application",
          error.response?.status || 500
        )
      );
    }
  }
);

router.post(
  "/applications/:uuid/restart",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.post(`/applications/${uuid}/restart`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to restart application",
          error.response?.status || 500
        )
      );
    }
  }
);

router.delete(
  "/applications/:uuid",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.delete(`/applications/${uuid}`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to delete application",
          error.response?.status || 500
        )
      );
    }
  }
);

router.get("/applications/:uuid/logs", verifyToken, checkAdminPermission, async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const coolify = getCoolifyClient();
    const response = await coolify.get(`/applications/${uuid}/logs`);
    res.json(response.data);
  } catch (error) {
    next(
      new AppError(
        error.response?.data?.message || "Failed to fetch logs",
        error.response?.status || 500
      )
    );
  }
});

router.post(
  "/databases/:uuid/start",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.post(`/databases/${uuid}/start`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to start database",
          error.response?.status || 500
        )
      );
    }
  }
);

router.post(
  "/databases/:uuid/stop",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.post(`/databases/${uuid}/stop`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to stop database",
          error.response?.status || 500
        )
      );
    }
  }
);

router.post(
  "/databases/:uuid/restart",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.post(`/databases/${uuid}/restart`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to restart database",
          error.response?.status || 500
        )
      );
    }
  }
);

router.delete(
  "/databases/:uuid",
  verifyToken,
  checkAdminPermission,
  async (req, res, next) => {
    try {
      const { uuid } = req.params;
      const coolify = getCoolifyClient();
      const response = await coolify.delete(`/databases/${uuid}`);
      res.json(response.data);
    } catch (error) {
      next(
        new AppError(
          error.response?.data?.message || "Failed to delete database",
          error.response?.status || 500
        )
      );
    }
  }
);


export default router;
