export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
  profile_image: string;
  gender: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface Counts {
  total: number;
  byRole: {
    admin: number;
    user: number;
  };
  byGender: {
    male: number;
    female: number;
  };
  byStatus: {
    active: number;
    inactive: number;
  };
}
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface UserForm {
  name: string;
  email: string;
  password: string;
  bio: string | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  country: string | null;
  role: string;
  is_active: boolean;
  profile_image: File | null;
}
