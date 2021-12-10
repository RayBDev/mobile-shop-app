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

type CartItem = {
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
};

export default CartItem;
