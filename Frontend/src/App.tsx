import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { lazy, Suspense } from "react";
import { AuthRoute } from "@/routes/AuthRoute";
import { AuthInitializer } from "@/routes/AuthInitializer";
import LandingPage from "@/pages/common/LandingPage";
import NotFoundPage from "@/pages/common/NotFond";
import AdminLayout from "@/components/admin/AdminLayout";
import UserLayout from "@/components/user/UserLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminQuizManagement from "@/pages/admin/QuizManagement";
import AdminUserManagement from "@/pages/admin/AdminUserManagement";
import UserDashboard from "@/pages/user/UserDashboard";
import QuizList from "@/pages/user/UserQuizList";
import TakeQuiz from "@/pages/user/TakeQuiz";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import QuizResult from "./pages/user/QuizResult";

const AuthRoutes = lazy(() => import("@/routes/AuthRoutes"));

const App: React.FC = () => {
  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <AuthInitializer>
          <div className="relative min-h-screen overflow-hidden scrollbar-none">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth */}
                <Route path="auth/*" element={<AuthRoute />}>
                  <Route path="*" element={<AuthRoutes />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminLayout />}>
                  <Route
                    path="admin/*"
                    element={<ProtectedRoute allowedRoles="admin" />}
                  >
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="quizzes" element={<AdminQuizManagement />} />
                    <Route path="users" element={<AdminUserManagement />} />
                  </Route>
                </Route>

                {/* User Routes */}
                <Route element={<UserLayout />}>
                  <Route
                    path="user/*"
                    element={<ProtectedRoute allowedRoles="user" />}
                  >
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="quizzes" element={<QuizList />} />
                    <Route path="quiz/:id" element={<TakeQuiz />} />
                    <Route path="quiz-result" element={<QuizResult />} />
                  </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
        </AuthInitializer>
      </BrowserRouter>
    </>
  );
};

export default App;
