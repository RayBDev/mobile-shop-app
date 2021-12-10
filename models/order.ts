import CartItem from './cart-item';

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

type Order = {
  /** Unique ID of the order */
  id: string;
  /** Array of items in the order */
  items: CartItem[];
  /** Total dollar value of order */
  totalAmount: number;
  /** Pre-formated Date Order was placed as a string */
  date: string;
};

export default Order;
