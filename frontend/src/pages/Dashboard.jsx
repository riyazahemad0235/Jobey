import { useContext } from "react";
import { JobContext } from "../context/JobContext";
import JobCard from "../components/JobCard";
import styles from "./Dashboard.module.css";

const COLUMNS = [
  { status: "Applied", title: "Applied" },
  { status: "Interviewed", title: "Interviews" },
  { status: "Rejected", title: "Rejected" },
];

function Dashboard() {
  const { userData, applications, changeStatus, removeApplication, dataReady } =
    useContext(JobContext);

  const inStatus = (status) => applications.filter((a) => a.status === status);

  const handleRemove = (application) => {
    const ok = window.confirm(
      `Remove ${application.job.position} at ${application.job.company} from your dashboard?`,
    );
    if (ok) removeApplication(application._id);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.welcome}>
        <h1>Welcome, {userData.name}</h1>
        <h2>Your job search dashboard</h2>
        <div className={styles.userData}>
          {COLUMNS.map(({ status, title }) => (
            <div key={status} className={styles.dataBox}>
              <h3>{title}</h3>
              <h3>{inStatus(status).length}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.board}>
        {COLUMNS.map(({ status, title }) => (
          <div key={status} className={styles.column}>
            <h2>{title}</h2>

            {!dataReady ? (
              <p className={styles.empty}>Loading...</p>
            ) : inStatus(status).length === 0 ? (
              <p className={styles.empty}>
                {status === "Applied"
                  ? "No applications yet. Open a job under Companies and choose Apply."
                  : `Nothing in ${title.toLowerCase()} yet.`}
              </p>
            ) : (
              inStatus(status).map((application) => (
                <JobCard
                  key={application._id}
                  job={application.job}
                  buttons={[
                    {
                      label: "View Details",
                      to: `/app/viewjob/${application.job._id}`,
                    },
                    {
                      label: "Remove",
                      variant: "outline",
                      onClick: () => handleRemove(application),
                    },
                  ]}
                >
                  <label className={styles.statusRow}>
                    Status
                    <select
                      value={application.status}
                      onChange={(e) =>
                        changeStatus(application._id, e.target.value)
                      }
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </label>
                </JobCard>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
