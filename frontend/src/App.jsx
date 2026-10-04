import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JobProvider from "./context/JobContext";
import Sidebar from "./layout/Sidebar";
import ProtectedRoute from "./pages/ProtectedRoute";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import SavedJobs from "./pages/SavedJobs";
import Archived from "./pages/Archived";
import Companies from "./pages/Companies";
import ViewJob from "./pages/ViewJob";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <JobProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Sidebar />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Navigate to="/app" replace />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="savedjobs" element={<SavedJobs />} />
            <Route path="archived" element={<Archived />} />
            <Route path="companies" element={<Companies />} />
            <Route path="viewjob/:id" element={<ViewJob />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </JobProvider>
    </BrowserRouter>
  );
}

export default App;
