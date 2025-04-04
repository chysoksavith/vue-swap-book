export interface User {
  id: number;
  email: string;
  role: string;
}
export interface LoginResponse {
  status: string;
  token: string;
  user: User;
}
export interface AuthError {
  status: string;
  message: string;
}
