import mongoose from "mongoose";
import Application, { STATUSES } from "../models/application.js";
import Job from "../models/jobs.js";

// GET /api/applications  -> only the logged-in user's applications
const getMyApplications = async (req, res) => {
  const applications = await Application.find({ user: req.user.userId })
    .populate("job")
    .sort({ updatedAt: -1 });

  // Skip applications whose job no longer exists
  res.json(applications.filter((a) => a.job));
};

// POST /api/applications  { jobId }
const applyToJob = async (req, res) => {
  const { jobId } = req.body ?? {};

  if (!mongoose.isValidObjectId(jobId)) {
    return res.status(400).json({ message: "A valid jobId is required" });
  }
  if (!(await Job.exists({ _id: jobId }))) {
    return res.status(404).json({ message: "Job not found" });
  }

  try {
    const application = await Application.create({
      user: req.user.userId,
      job: jobId,
    });
    await application.populate("job");
    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "You have already applied to this job" });
    }
    throw err;
  }
};

// PATCH /api/applications/:id  { status }
const updateApplication = async (req, res) => {
  const { status } = req.body ?? {};

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid application id" });
  }
  if (!STATUSES.includes(status)) {
    return res
      .status(400)
      .json({ message: `Status must be one of: ${STATUSES.join(", ")}` });
  }

  // The user filter means nobody can touch someone else's application
  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    { status },
    { new: true },
  ).populate("job");

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }
  res.json(application);
};

// DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid application id" });
  }
  const application = await Application.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }
  res.json({ message: "Application removed" });
};

export { getMyApplications, applyToJob, updateApplication, deleteApplication };
