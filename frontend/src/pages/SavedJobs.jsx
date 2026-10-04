import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import JobCard from "../components/JobCard";
import styles from "./JobPages.module.css";

function SavedJobs() {
  const { savedJobs, unsaveJob, dataReady } = useContext(JobContext);

  return (
    <div className={styles.contentArea}>
      <h1 className={styles.pageTitle}>Saved jobs</h1>

      {!dataReady ? (
        <p className={styles.empty}>Loading...</p>
      ) : savedJobs.length === 0 ? (
        <p className={styles.empty}>
          You haven't saved any jobs yet. Use Save on any job card to keep it
          here.
        </p>
      ) : (
        <div className={styles.jobsGrid}>
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              buttons={[
                { label: "View Details", to: `/app/viewjob/${job._id}` },
                {
                  label: "Remove",
                  variant: "outline",
                  onClick: () => unsaveJob(job._id),
                },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedJobs;
