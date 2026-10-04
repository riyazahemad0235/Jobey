import { useContext } from "react";
import { Link } from "react-router-dom";
import { JobContext } from "../context/JobContext";
import styles from "./JobCard.module.css";

// One card used everywhere (Dashboard, Companies, Search, Saved, Archived).
// - `buttons`: optional [{ label, to?, onClick?, variant? }] to replace the defaults
// - `children`: optional extra content shown above the buttons
function JobCard({ job, buttons, children }) {
  const { savedJobs, saveJob, unsaveJob } = useContext(JobContext);

  if (!job) return null;

  const isSaved = savedJobs.some((j) => j._id === job._id);

  const defaultButtons = [
    { label: "View Details", to: `/app/viewjob/${job._id}` },
    {
      label: isSaved ? "Saved" : "Save",
      variant: isSaved ? "outline" : "solid",
      onClick: () => (isSaved ? unsaveJob(job._id) : saveJob(job._id)),
    },
  ];

  const list = buttons ?? defaultButtons;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {job.logo ? (
          <img src={job.logo} alt="" className={styles.logo} />
        ) : (
          <div className={styles.fallback}>
            {(job.company || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <h3 className={styles.position}>{job.position}</h3>
      </div>

      <div className={styles.details}>
        <h4>{job.company}</h4>
        {job.salary && <p>{job.salary}</p>}
        {job.location && <p>{job.location}</p>}
        {job.jobType && <p>{job.jobType}</p>}
      </div>

      {children}

      <div className={styles.actions}>
        {list.map((b) =>
          b.to ? (
            <Link
              key={b.label}
              to={b.to}
              className={`${styles.btn} ${styles.solid}`}
            >
              {b.label}
            </Link>
          ) : (
            <button
              key={b.label}
              type="button"
              onClick={b.onClick}
              className={`${styles.btn} ${
                b.variant === "outline" ? styles.outline : styles.solid
              }`}
            >
              {b.label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export default JobCard;
