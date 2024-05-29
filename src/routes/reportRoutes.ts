import { Router } from "express";
import {
  getLocations,
  getWeeklyReport,
  createOrUpdateWeeklyReport,
  getSummary,
  getAllReports,
} from "../controllers/reportController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/locations", authenticate, getLocations);
router.get(
  "/reports/:locationId/:weekStartDate",
  authenticate,
  getWeeklyReport
);
router.get("/reports", authenticate, getAllReports);
router.post("/reports", authenticate, createOrUpdateWeeklyReport);
router.get("/summary/:locationId/:weekStartDate", authenticate, getSummary);

export default router;
