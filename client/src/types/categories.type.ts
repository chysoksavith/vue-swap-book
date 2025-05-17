export interface Category {
  id: number;
  name: string;
  slug: string;
  published: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
  depth?: number; 
  isExpanded?: boolean; 
}

export interface CategoryForm {
  id?: number;
  name: string;
  published: number;
  parent_id?: number | null;
  slug?: string;
}

export interface ValidationErrors {
  name?: string[];
  published?: string[];
  parent_id?: string[];
  [key: string]: string[] | undefined;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  level: number;
  isVisible?: boolean;
}

export interface CategoryBreadcrumb {
  id: number;
  name: string;
}
