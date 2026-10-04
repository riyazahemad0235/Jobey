import mongoose from "mongoose";

export const STATUSES = ["Applied", "Interviewed", "Rejected"];

// One document = "this user applied to this job, and it is at this stage".
// This is what makes Applied / Interviewed / Rejected per-user.
const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: { type: String, enum: STATUSES, default: "Applied" },
  },
  { timestamps: true },
);

// A user can only have one application per job
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
