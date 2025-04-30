export interface Categories {
  id: number;
  name: string;
  published: number;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryForm {
  id?: number;
  name: string;
  published: number;
}

export interface ValidationErrors {
  name?: string;
  published?: string;
}
