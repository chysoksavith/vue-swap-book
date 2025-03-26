export interface Book {
  id: number;
  user_id: number;
  title: string;
  author: string;
  description: string;
  category_id: number;
  condition_book: "New" | "Good" | "Used";
  image: string;
  is_approved: boolean;
  status: "Available" | "Swapped" | "Pending";
  created_at: Date;
  updated_at: Date;
}
