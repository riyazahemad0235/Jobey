import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createJob,
  deleteJob,
  getJob,
  getJobById,
  updateJob,
  searchJob,
} from "../controller/jobController.js";

const router = express.Router();

router.use(protect);

router.get("/", getJob);
router.get("/search", searchJob); // must stay above "/:id"
router.get("/:id", getJobById);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
