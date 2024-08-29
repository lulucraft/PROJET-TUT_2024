import { Product } from "./product";

export interface Order {
  id: string;
  date: Date;
  products?: Product[];
}
