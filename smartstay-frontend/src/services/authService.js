import authApi from "../api/axios";

export const authService = {
  async login(email, password) {
    try {
      const response = await authApi.post("/api/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      return response.data; // { token: "..." }
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw "Invalid email or password";
    }
  },

  async register(userData) {
    try {
      const response = await authApi.post("/api/auth/register", {
        ...userData,
        email: userData.email.toLowerCase(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw "Registration failed";
    }
  },
};
