import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getMyApplications,
  applyToJob,
  updateApplication,
  deleteApplication,
} from "../controller/applicationController.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyApplications);
router.post("/", applyToJob);
router.patch("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
