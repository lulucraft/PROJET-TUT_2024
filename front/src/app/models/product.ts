import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  category: Category;
  stockQuantity: number;
  imageLink?: string;
  refund: number;
}
