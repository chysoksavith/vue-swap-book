export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  published: boolean;
  created_at: Date;
  updated_at: Date;
  children?: Category[];
}
