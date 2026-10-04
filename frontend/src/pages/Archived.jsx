import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import JobCard from "../components/JobCard";
import styles from "./JobPages.module.css";

function Archived() {
  const { archivedJobs, unarchiveJob, dataReady } = useContext(JobContext);

  return (
    <div className={styles.contentArea}>
      <h1 className={styles.pageTitle}>Archived jobs</h1>

      {!dataReady ? (
        <p className={styles.empty}>Loading...</p>
      ) : archivedJobs.length === 0 ? (
        <p className={styles.empty}>
          Nothing archived yet. Open a job and choose Archive to move it here.
        </p>
      ) : (
        <div className={styles.jobsGrid}>
          {archivedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              buttons={[
                { label: "View Details", to: `/app/viewjob/${job._id}` },
                {
                  label: "Unarchive",
                  variant: "outline",
                  onClick: () => unarchiveJob(job._id),
                },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Archived;
