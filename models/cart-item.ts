class CartItem {
  /** Quantity of item in cart */
  quantity: number;
  /** Price of item in cart */
  productPrice: number;
  /** Title of item in cart */
  productTitle: string;
  /** Extended sell of item in cart */
  sum: number;
  constructor(
    quantity: number,
    productPrice: number,
    productTitle: string,
    sum: number
  ) {
    this.quantity = quantity;
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    this.sum = sum;
  }
}

export default CartItem;
