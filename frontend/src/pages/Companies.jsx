import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import JobCard from "../components/JobCard";
import styles from "./JobPages.module.css";

function Companies() {
  const { jobQuery, dataReady } = useContext(JobContext);

  return (
    <div className={styles.contentArea}>
      <h1 className={styles.pageTitle}>All available jobs</h1>

      {!dataReady ? (
        <p className={styles.empty}>Loading jobs...</p>
      ) : jobQuery.length === 0 ? (
        <p className={styles.empty}>No jobs have been listed yet.</p>
      ) : (
        <div className={styles.jobsGrid}>
          {jobQuery.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Companies;
