import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { JobContext } from "../context/JobContext";
import JobCard from "../components/JobCard";
import styles from "./JobPages.module.css";

function SearchPage() {
  const { jobQuery, dataReady } = useContext(JobContext);

  // The search term lives in the URL, so it survives a page refresh
  const [params] = useSearchParams();
  const term = (params.get("q") || "").trim();
  const needle = term.toLowerCase();

  const results = jobQuery.filter((job) =>
    [job.company, job.position, job.location].some((field) =>
      (field || "").toLowerCase().includes(needle),
    ),
  );

  return (
    <div className={styles.contentArea}>
      <h1 className={styles.pageTitle}>
        {term ? `Results for "${term}"` : "All jobs"}
      </h1>

      {!dataReady ? (
        <p className={styles.empty}>Loading jobs...</p>
      ) : results.length === 0 ? (
        <p className={styles.empty}>
          No jobs match "{term}". Try a company name, role, or city.
        </p>
      ) : (
        <div className={styles.jobsGrid}>
          {results.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
