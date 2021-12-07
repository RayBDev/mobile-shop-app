import CartItem from '../../models/cart-item';

export const ADD_ORDER = 'ADD_ORDER';

type CartItemProductId = {
  productId: string;
};

type CartItems = CartItem & CartItemProductId;

export const addOrder = (cartItems: CartItems[], totalAmount: number) => {
  return {
    type: ADD_ORDER,
    orderData: { items: cartItems, amount: totalAmount },
  };
};
