import { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../api";

export const JobContext = createContext();

function JobProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Shared catalog of jobs (same for everyone)
  const [jobQuery, setJobQuery] = useState([]);

  // Per-user data (each logged-in user only ever receives their own)
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [archivedJobs, setArchivedJobs] = useState([]);

  const [dataReady, setDataReady] = useState(false);
  const [notice, setNotice] = useState(null);

  const notify = useCallback((text, type = "success") => {
    setNotice({ text, type });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  // ---------- auth ----------
  const getCurrentUser = useCallback(async () => {
    try {
      setUserData(await api("/users/me"));
    } catch {
      setUserData(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const login = async (email, password) => {
    const data = await api("/users/login", {
      method: "POST",
      body: { email, password },
    });
    setUserData(data.user);
  };

  const register = (name, email, password) =>
    api("/users/register", { method: "POST", body: { name, email, password } });

  const logout = async () => {
    try {
      await api("/users/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUserData(null); // the effect below wipes all per-user data
    }
  };

  // ---------- load everything for the logged-in user ----------
  useEffect(() => {
    if (!userData?._id) {
      setJobQuery([]);
      setApplications([]);
      setSavedJobs([]);
      setArchivedJobs([]);
      setDataReady(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const [jobs, apps, saved, archived] = await Promise.all([
          api("/jobs"),
          api("/applications"),
          api("/users/saved"),
          api("/users/archived"),
        ]);
        if (cancelled) return;
        setJobQuery(jobs);
        setApplications(apps);
        setSavedJobs(saved);
        setArchivedJobs(archived);
      } catch (err) {
        if (!cancelled) notify(err.message, "error");
      } finally {
        if (!cancelled) setDataReady(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userData?._id, notify]);

  // ---------- actions ----------
  // Runs an API call, shows a toast, and returns true/false.
  const run = async (fn, successMessage) => {
    try {
      await fn();
      if (successMessage) notify(successMessage);
      return true;
    } catch (err) {
      notify(err.message, "error");
      return false;
    }
  };

  const applyToJob = (jobId) =>
    run(async () => {
      const application = await api("/applications", {
        method: "POST",
        body: { jobId },
      });
      setApplications((prev) => [application, ...prev]);
    }, "Added to your Applied list");

  const changeStatus = (applicationId, status) =>
    run(async () => {
      const updated = await api(`/applications/${applicationId}`, {
        method: "PATCH",
        body: { status },
      });
      setApplications((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a)),
      );
    }, `Moved to ${status}`);

  const removeApplication = (applicationId) =>
    run(async () => {
      await api(`/applications/${applicationId}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((a) => a._id !== applicationId));
    }, "Application removed");

  const saveJob = (jobId) =>
    run(async () => {
      setSavedJobs(await api(`/users/saved/${jobId}`, { method: "POST" }));
    }, "Job saved");

  const unsaveJob = (jobId) =>
    run(async () => {
      setSavedJobs(await api(`/users/saved/${jobId}`, { method: "DELETE" }));
    }, "Removed from saved");

  const archiveJob = (jobId) =>
    run(async () => {
      setArchivedJobs(
        await api(`/users/archived/${jobId}`, { method: "POST" }),
      );
    }, "Job archived");

  const unarchiveJob = (jobId) =>
    run(async () => {
      setArchivedJobs(
        await api(`/users/archived/${jobId}`, { method: "DELETE" }),
      );
    }, "Removed from archive");

  const updateProfile = (fields) =>
    run(async () => {
      setUserData(await api("/users/me", { method: "PUT", body: fields }));
    }, "Profile updated");

  return (
    <JobContext.Provider
      value={{
        userData,
        authLoading,
        getCurrentUser,
        login,
        register,
        logout,
        updateProfile,
        jobQuery,
        applications,
        savedJobs,
        archivedJobs,
        dataReady,
        applyToJob,
        changeStatus,
        removeApplication,
        saveJob,
        unsaveJob,
        archiveJob,
        unarchiveJob,
        notice,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export default JobProvider;
