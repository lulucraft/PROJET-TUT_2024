import { Order } from "./order";
import { User } from "./user";

export interface UserOrder {
  user: User;
  order: Order;
}
