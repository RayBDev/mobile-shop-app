import { AnyAction } from 'redux';
import CartItem from '../../models/cart-item';
import { ADD_TO_CART } from '../actions/cart';

type CartItemType = {
  [key: string]: CartItem;
};

type InitialState = {
  items: CartItemType;
  totalAmount: number;
};

const initialState: InitialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;

      if (state.items[addedProduct.id]) {
        // already have the item in the cart
      } else {
        const newCartItem = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: newCartItem },
        };
      }
  }
  return state;
};
