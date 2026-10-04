import { useState, useContext } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import styles from "./Login.module.css";
import { JobContext } from "../context/JobContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userData } = useContext(JobContext);
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(data.email, data.password);
      navigate("/app");
    } catch (err) {
      setError(
        err.status ? err.message : "Could not reach the server. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Already logged in? Skip the login page. Keep this after all hooks.
  if (userData) return <Navigate to="/app" replace />;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.firstContainer}>
        <div className={styles.firstSec}>
          <div className={styles.titleSec}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "50px" }}
            >
              monitoring
            </span>
            <h1>Jobey</h1>
          </div>
          <h1>Sign in to Jobey</h1>
        </div>
      </div>
      <div className={styles.secondContainer}>
        <div className={styles.secondSec}>
          <img src="logo-image.png" alt="" className={styles.logoImg} />
          <div className={styles.textArea}>
            <h1>Manage your career </h1>
            <h1>journey</h1>
            <h2>Log in to track applications, interviews </h2>
            <h2>and more</h2>
          </div>
        </div>
        <div className={styles.thirdSec}>
          <div className={styles.textSec}>
            <h1>Welcome back!</h1>
            <h3>Sign in to your account</h3>
          </div>
          {location.state?.registered && (
            <p style={{ color: "green", marginTop: "10px" }}>
              Account created. You can sign in now.
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputSec}>
              <div className={styles.inputBox}>
                <h3>Email address</h3>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={handleChange}
                  name="email"
                  required
                />
              </div>
              <div className={styles.inputBox}>
                <h3>Password</h3>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={handleChange}
                  name="password"
                  required
                />
              </div>
            </div>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            <div className={styles.signBtn}>
              <button type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Login"}
              </button>
            </div>
          </form>
          <div className={styles.footerSec}>
            <p id={styles.footer}>
              Don't have an account?
              <Link to="/signin" style={{ color: "blue" }}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
