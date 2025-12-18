export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  parentName?: string;
  productCount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  parentId: number | null;
  description?: string;
}
