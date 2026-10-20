import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BoardPage from "./pages/BoardPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProfilePage from "./pages/ProfilePage";
import RollupPage from "./pages/RollupPage";
import LandingPage from "./pages/LandingPage";
import TenantRegistrationPage from "./pages/TenantRegistrationPage";
import DemoBoardPage from "./pages/DemoBoardPage";
import DemoRollupPage from "./pages/DemoRollupPage";

function RootRoute() {
  const { token } = useAuth();

  if (token) {
    return (
      <ProtectedRoute>
        <BoardPage />
      </ProtectedRoute>
    );
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<TenantRegistrationPage />} />
          <Route path="/demo" element={<DemoBoardPage />} />
          <Route path="/demo/rollup" element={<DemoRollupPage />} />
          <Route path="/" element={<RootRoute />} />
          <Route
            path="/board"
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rollup"
            element={
              <ProtectedRoute>
                <RollupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
