import { CartItems } from './cart-item';

// class Order {
//   id: string;
//   items: CartItem[];
//   totalAmount: number;
//   date: Date;
//   constructor(id: string, items: CartItem[], totalAmount: number, date: Date) {
//     this.id = id;
//     this.items = items;
//     this.totalAmount = totalAmount;
//     this.date = date;
//   }

//   get readableDate() {
//     return format(this.date, 'MMM do yyyy, hh:mm aaa');
//   }
// }

export type OrderDetails = {
  /** Array of items in the order */
  items: CartItems;
  /** Total dollar value of order */
  totalAmount: number;
  /** Pre-formatted Date Order was placed as a string */
  date: string;
};

export type AllOwnerOrders = {
  [key: string]: Omit<OrderDetails, 'id'>;
};

export type Order = {
  /** Unique ID of the order */
  id: string;
  /** ID of the order's owner */
  ownerId: string;
  /** The Items, totalAmount and date of the order */
  order: OrderDetails;
};

export default Order;
