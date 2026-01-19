import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      email: decoded.sub,
      role: decoded.role, // ROLE_USER or ROLE_ADMIN
    };
  } catch (e) {
    return null;
  }
}
