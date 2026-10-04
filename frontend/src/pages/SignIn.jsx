import { useContext, useState } from "react";
import styles from "./SignIn.module.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { JobContext } from "../context/JobContext";

// This page registers a new account (route: /signin)
function SignIn() {
  const navigate = useNavigate();
  const { register, userData } = useContext(JobContext);
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(user.name, user.email, user.password);
      navigate("/", { state: { registered: true } });
    } catch (err) {
      setError(
        err.status ? err.message : "Could not reach the server. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1>Create your Jobey account</h1>
        </div>
      </div>
      <div className={styles.secondContainer}>
        <div className={styles.secondSec}>
          <img src="jobeyLogo.png" alt="" className={styles.logoImg} />
          <div className={styles.textArea}>
            <h1>Manage your career </h1>
            <h1>journey</h1>
            <h2>Sign up to track applications, interviews </h2>
            <h2>and more</h2>
          </div>
        </div>
        <div className={styles.thirdSec}>
          <div className={styles.textSec}>
            <h1>Get started</h1>
            <h3>Create your account</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputSec}>
              <div className={styles.inputBox}>
                <h3>Name</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputBox}>
                <h3>Email address</h3>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={handleChange}
                  name="email"
                  required
                />
              </div>
              <div className={styles.inputBox}>
                <h3>Password</h3>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={user.password}
                  onChange={handleChange}
                  name="password"
                  minLength={6}
                  required
                />
              </div>
            </div>
            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
            )}
            <div className={styles.signBtn}>
              <button type="submit" disabled={submitting}>
                {submitting ? "Creating account..." : "Register"}
              </button>
            </div>
          </form>
          <div className={styles.footerSec}>
            <p id={styles.footer}>
              Already have an account?
              <Link to="/" style={{ color: "blue" }}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
