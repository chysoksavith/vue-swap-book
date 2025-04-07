import api from "../config/axios";

interface LoginCredentials {
  email: string;
  password: string;
}
interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string; 
    role: string;
  };
}
export const authService = {
  /**
   * Authenticates admin user with email and password
   * @param credentials - Admin login credentials
   * @returns Promise containing token and user data
   * @throws Error if authentication fails
   */

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/users/login", credentials);
    console.log("login", data);
    return data;
  },

  /**
   * Validates current auth token
   * @returns Promise<boolean> true if token is valid
   */
  async validateToken(): Promise<boolean> {
    try {
      await api.get("/users/validate-token");
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Logs out user and cleans up local storage
   */
  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error("No active session")
    }
    try {
      await api.post("/users/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  
  },
};
