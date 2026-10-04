import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { JobContext } from "../context/JobContext";
import styles from "./ViewJob.module.css";

const toList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
};

function ViewJob() {
  const {
    jobQuery,
    dataReady,
    applications,
    savedJobs,
    archivedJobs,
    applyToJob,
    saveJob,
    unsaveJob,
    archiveJob,
    unarchiveJob,
  } = useContext(JobContext);
  const { id } = useParams();

  if (!dataReady) {
    return <p className={styles.message}>Loading job...</p>;
  }

  const job = jobQuery.find((j) => j._id === id);

  if (!job) {
    return (
      <div className={styles.message}>
        <p>This job doesn't exist or was removed.</p>
        <Link to="/app/companies">Back to all jobs</Link>
      </div>
    );
  }

  const application = applications.find((a) => a.job?._id === job._id);
  const isSaved = savedJobs.some((j) => j._id === job._id);
  const isArchived = archivedJobs.some((j) => j._id === job._id);

  const handleApply = () => {
    if (!window.confirm(`Apply to ${job.company} for ${job.position}?`)) return;
    applyToJob(job._id);
  };

  const handleSave = () => (isSaved ? unsaveJob(job._id) : saveJob(job._id));

  const handleArchive = () => {
    if (isArchived) return unarchiveJob(job._id);
    if (!window.confirm(`Archive ${job.position} at ${job.company}?`)) return;
    archiveJob(job._id);
  };

  const qualifications = toList(job.qualifications);
  const skills = toList(job.skillsRequired);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.firstContainer}>
        <h1>Job Description</h1>
      </div>

      <div className={styles.secondContainer}>
        <div className={styles.firstSec}>
          <div className={styles.titleSec}>
            {job.logo && <img src={job.logo} alt="" />}
            <h1>{job.company}</h1>
          </div>

          <div className={styles.buttonSec}>
            <button onClick={handleApply} disabled={Boolean(application)}>
              {application ? `Applied (${application.status})` : "Apply"}
            </button>
            <button onClick={handleSave}>{isSaved ? "Unsave" : "Save"}</button>
            <button onClick={handleArchive}>
              {isArchived ? "Unarchive" : "Archive"}
            </button>
          </div>
        </div>

        <div className={styles.description}>
          <div className={styles.box}>
            <h3>Role</h3>
            <p>{job.position}</p>

            {job.description && (
              <>
                <h3>Role description</h3>
                <p>{job.description}</p>
              </>
            )}

            <h3>Location</h3>
            <p>{job.location || "Not specified"}</p>

            <h3>Job type</h3>
            <p>{job.jobType || "Not specified"}</p>

            <h3>Salary CTC</h3>
            <p>{job.salary || "Not specified"}</p>
          </div>

          {qualifications.length > 0 && (
            <div className={styles.box}>
              <h3>Qualifications</h3>
              <ul className={styles.list}>
                {qualifications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {skills.length > 0 && (
            <div className={styles.box}>
              <h3>Skills required</h3>
              <ul className={styles.list}>
                {skills.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewJob;
