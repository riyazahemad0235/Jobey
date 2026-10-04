import { useContext, useState } from "react";
import { JobContext } from "../context/JobContext";
import styles from "./Profile.module.css";

const Profile = () => {
  const { userData, applications, savedJobs, archivedJobs, updateProfile } =
    useContext(JobContext);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", location: "" });

  const count = (status) =>
    applications.filter((a) => a.status === status).length;

  const startEditing = () => {
    setForm({
      name: userData.name || "",
      phone: userData.phone || "",
      location: userData.location || "",
    });
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ok = await updateProfile(form);
    setSaving(false);
    if (ok) setEditing(false);
  };

  // While editing show the draft, otherwise show the saved profile
  const value = (field) => (editing ? form[field] : userData[field] || "");

  return (
    <div className={styles.contentArea}>
      <h1 className={styles.pageTitle}>My Profile</h1>

      <div className={styles.profileCard}>
        <div className={styles.cardHeader}>
          <div className={styles.avatarSec}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "60px" }}
            >
              account_circle
            </span>
            <div>
              <h2>{userData.name}</h2>
              <p>{userData.email}</p>
            </div>
          </div>
          {!editing && (
            <button
              type="button"
              className={styles.editBtn}
              onClick={startEditing}
            >
              Edit profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputSec}>
            <div className={styles.inputBox}>
              <h3>Name</h3>
              <input
                type="text"
                name="name"
                value={value("name")}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </div>

            <div className={styles.inputBox}>
              <h3>Email address</h3>
              <input type="email" value={userData.email} disabled />
            </div>

            <div className={styles.inputBox}>
              <h3>Phone number</h3>
              <input
                type="text"
                name="phone"
                value={value("phone")}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className={styles.inputBox}>
              <h3>Location</h3>
              <input
                type="text"
                name="location"
                value={value("location")}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          {editing && (
            <div className={styles.btnSec}>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      <div className={styles.statsCard}>
        <h2>Application overview</h2>
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <h3>Applied</h3>
            <h1>{count("Applied")}</h1>
          </div>
          <div className={styles.statBox}>
            <h3>Interviews</h3>
            <h1>{count("Interviewed")}</h1>
          </div>
          <div className={styles.statBox}>
            <h3>Rejected</h3>
            <h1>{count("Rejected")}</h1>
          </div>
          <div className={styles.statBox}>
            <h3>Saved</h3>
            <h1>{savedJobs.length}</h1>
          </div>
          <div className={styles.statBox}>
            <h3>Archived</h3>
            <h1>{archivedJobs.length}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
