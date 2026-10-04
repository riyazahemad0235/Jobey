import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createUser,
  loginUser,
  logoutUser,
  currentUser,
  updateProfile,
  saved,
  archived,
} from "../controller/userController.js";

const router = express.Router();

// Public
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Everything below needs a logged-in user
router.get("/me", protect, currentUser);
router.put("/me", protect, updateProfile);

router.get("/saved", protect, saved.list);
router.post("/saved/:jobId", protect, saved.add);
router.delete("/saved/:jobId", protect, saved.remove);

router.get("/archived", protect, archived.list);
router.post("/archived/:jobId", protect, archived.add);
router.delete("/archived/:jobId", protect, archived.remove);

export default router;
