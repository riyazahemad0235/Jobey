import mongoose from "mongoose";
import Job from "../models/jobs.js";
import User from "../models/users.js";
import Application from "../models/application.js";

const TEXT_FIELDS = [
  "company",
  "position",
  "location",
  "jobType",
  "salary",
  "description",
  "logo",
  "jobUrl",
];

const toList = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return undefined;
};

// Only copy fields we expect - never pass req.body straight to the database
const pickJobFields = (body = {}) => {
  const data = {};
  for (const field of TEXT_FIELDS) {
    if (typeof body[field] === "string") data[field] = body[field];
  }
  const qualifications = toList(body.qualifications);
  if (qualifications) data.qualifications = qualifications;
  const skillsRequired = toList(body.skillsRequired);
  if (skillsRequired) data.skillsRequired = skillsRequired;
  return data;
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getJob = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
};

const getJobById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid job id" });
  }
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

const createJob = async (req, res) => {
  const job = await Job.create({
    ...pickJobFields(req.body),
    createdBy: req.user.userId,
  });
  res.status(201).json(job);
};

const updateJob = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid job id" });
  }
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  if (!job.createdBy || job.createdBy.toString() !== req.user.userId) {
    return res.status(403).json({ message: "You can only edit your own jobs" });
  }

  job.set(pickJobFields(req.body));
  await job.save();
  res.json(job);
};

const deleteJob = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid job id" });
  }
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  if (!job.createdBy || job.createdBy.toString() !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "You can only delete your own jobs" });
  }

  await job.deleteOne();
  // Clean up everyone's references to the deleted job
  await Application.deleteMany({ job: job._id });
  await User.updateMany(
    {},
    { $pull: { savedJobs: job._id, archivedJobs: job._id } },
  );

  res.json({ message: "Job deleted successfully" });
};

// GET /api/jobs/search?q=google  (case-insensitive, matches company/position/location)
const searchJob = async (req, res) => {
  const q = String(req.query.q ?? req.query.company ?? "").trim();
  if (!q) return res.json([]);

  const rx = new RegExp(escapeRegex(q), "i");
  const jobs = await Job.find({
    $or: [{ company: rx }, { position: rx }, { location: rx }],
  });
  res.json(jobs);
};

export { getJob, getJobById, createJob, updateJob, deleteJob, searchJob };
