import mongoose from "mongoose";

// A Job is a shared listing (the "catalog").
// Per-user state (applied / interviewed / rejected, saved, archived)
// is NOT stored here - see models/application.js and models/users.js.
const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    jobType: { type: String, trim: true },
    salary: { type: String, trim: true },
    description: { type: String },
    qualifications: [{ type: String }],
    skillsRequired: [{ type: String }],
    logo: { type: String },
    jobUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
