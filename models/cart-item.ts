// class CartItem {
//   /** ID of cart item */
//   productId: string;
//   /** Quantity of item in cart */
//   quantity: number;
//   /** Price of item in cart */
//   productPrice: number;
//   /** Title of item in cart */
//   productTitle: string;
//   /** Extended sell of item in cart */
//   sum: number;
//   constructor(
//     productId: string,
//     quantity: number,
//     productPrice: number,
//     productTitle: string,
//     sum: number
//   ) {
//     this.productId = productId;
//     this.quantity = quantity;
//     this.productPrice = productPrice;
//     this.productTitle = productTitle;
//     this.sum = sum;
//   }
// }

export type CartItem = {
  /** ID of cart item */
  productId: string;
  /** Quantity of item in cart */
  quantity: number;
  /** Price of item in cart */
  productPrice: number;
  /** Title of item in cart */
  productTitle: string;
  /** Extended sell of item in cart */
  sum: number;
  /** The push token of the product owner */
  productOwnerPushToken: string | null;
};

export type CartItems = {
  [key: string]: Omit<CartItem, 'productId'>;
};

export type CartDetails = {
  /** An object of product id's that each contain an object with a cart item */
  items: CartItems;
  /** The total dollar value of all the sums (extended sells) of all the cart items */
  totalAmount: number;
};

export type Cart = {
  /** The owner ID which is also the id cart  */
  ownerId: string;
  /** All cart details including items and total dollar amount */
  cart: CartDetails;
};

export default CartItem;
