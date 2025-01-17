import { Router } from "express";
import {
  getLocations,
  getWeeklyReport,
  createOrUpdateWeeklyReport,
  getSummary,
  getReportAvailability,
  getAllReports,
} from "../controllers/reportController";
import { authenticate } from "../middlewares/auth";
import asyncHandler from "../middlewares/asyncHandler";

const router = Router();

router.get("/locations", authenticate, getLocations);
router.get(
  "/reports/:locationId/:weekStartDate",
  authenticate,
  getWeeklyReport
);
router.get("/reports", authenticate, asyncHandler(getAllReports));
router.post("/reports", authenticate, asyncHandler(createOrUpdateWeeklyReport));
router.get(
  "/summary/:locationId/:weekStartDate",
  authenticate,
  asyncHandler(getSummary)
);
router.get(
  "/report-availability/:weekStartDate",
  authenticate,
  asyncHandler(getReportAvailability)
);

export default router;
