import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Tooltip } from "react-tooltip";
import { isAuthenticated } from "./api/auth";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const LoadingSpinner = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
      <Tooltip id="backup-tooltip" />
      <Tooltip id="internal-url-tooltip" />
      <Tooltip id="external-url-tooltip" />
    </BrowserRouter>
  );
};

export default App;
