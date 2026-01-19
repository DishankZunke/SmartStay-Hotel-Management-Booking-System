import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

/* USER */
import UserDashboard from "./pages/user/UserDashboard";
import RoomsPage from "./pages/user/RoomsPage";
import BookingPage from "./pages/user/BookingPage";
import UserLayout from "./layouts/UserLayout";

/* ADMIN */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminRooms from "./pages/admin/AdminRooms";

function RedirectAfterLogin() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "ROLE_ADMIN") {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Navigate to="/user/dashboard" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Root */}
      <Route path="/" element={<RedirectAfterLogin />} />

      {/* ================= USER ROUTES (WITH LAYOUT) ================= */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <RoleRoute role="ROLE_USER">
              <UserLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="rooms/:hotelId" element={<RoomsPage />} />
        <Route path="book/:roomId" element={<BookingPage />} />
      </Route>

      {/* ================= ADMIN ROUTES (UNCHANGED) ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute role="ROLE_ADMIN">
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="hotels" element={<AdminHotels />} />
        <Route path="rooms" element={<AdminRooms />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
