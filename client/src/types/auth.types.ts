export interface User {
  id: number;
  email: string;
  name: string;
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
