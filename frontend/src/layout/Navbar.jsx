import { useContext, useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { JobContext } from "../context/JobContext";

function Navbar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [inputValue, setInputValue] = useState(params.get("q") ?? "");

  const { logout } = useContext(JobContext);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = inputValue.trim();

    if (!term) {
      navigate("/app");
      return;
    }
    navigate(`/app/search?q=${encodeURIComponent(term)}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.navbarContainer}>
        <form className={styles.secondContainer} onSubmit={handleSearch}>
          <input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            className={styles.jobInput}
            placeholder="Search by company, role or city"
          />

          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
        </form>

        <div className={styles.thirdContainer}>
          <div className={styles.profile}>
            <span
              className="material-symbols-outlined"
              style={{ cursor: "pointer" }}
            >
              account_circle
            </span>

            <Link
              to="/app/profile"
              style={{ color: "black", textDecoration: "none" }}
            >
              <h1 style={{ fontSize: "25px" }}>Profile</h1>
            </Link>
          </div>

          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
