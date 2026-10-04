import { useContext } from "react";
import styles from "./Sidebar.module.css";
import Navbar from "./Navbar";
import { Outlet, Link, NavLink } from "react-router-dom";
import { JobContext } from "../context/JobContext";

const LINKS = [
  { to: "/app", icon: "home", label: "Dashboard", end: true },
  { to: "/app/savedjobs", icon: "bookmark_add", label: "Saved jobs" },
  { to: "/app/archived", icon: "archive", label: "Archived" },
  { to: "/app/companies", icon: "corporate_fare", label: "Companies" },
];

function Sidebar() {
  const { notice } = useContext(JobContext);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sideBar}>
        <div className={styles.firstContainer}>
          <div className={styles.webIcon}>
            <span className="material-symbols-outlined">monitoring</span>
            <Link to="/app" style={{ textDecoration: "none", color: "inherit" }}>
              <h1 className={styles.linkTitle}>Jobey</h1>
            </Link>
          </div>
        </div>

        <nav className={styles.secondContainer}>
          {LINKS.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              <span className="material-symbols-outlined">{icon}</span>
              <h2>{label}</h2>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={styles.content}>
        <Navbar />
        <Outlet />
      </div>

      {notice && (
        <div
          role="status"
          className={`${styles.toast} ${
            notice.type === "error" ? styles.toastError : ""
          }`}
        >
          {notice.text}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
