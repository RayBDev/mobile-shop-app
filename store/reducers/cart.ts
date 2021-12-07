import { AnyAction } from 'redux';
import CartItem from '../../models/cart-item';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';

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
      const productPrice: number = addedProduct.price;
      const productTitle: string = addedProduct.title;

      let updatedOrNewCartItem: CartItem;

      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].sum + productPrice
        );
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
          totalAmount: state.totalAmount + productPrice,
        };
      } else {
        updatedOrNewCartItem = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
          totalAmount: state.totalAmount + productPrice,
        };
      }
    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pid];
      const currentQty = selectedCartItem.quantity;
      type CartItemObject = {
        [key: string]: CartItem;
      };
      let updatedCartItems: CartItemObject;

      if (currentQty > 1) {
        // need to reduce, not erase
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };
  }
  return state;
};
