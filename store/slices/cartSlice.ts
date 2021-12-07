import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import CartItem from '../../models/cart-item';
import Product from '../../models/product';

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

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const addedProduct = action.payload;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;

      let updatedOrNewCartItem: CartItem;

      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].sum + productPrice
        );
        state.items = { [addedProduct.id]: updatedOrNewCartItem };
        state.totalAmount = state.totalAmount + productPrice;
      } else {
        updatedOrNewCartItem = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
        state.items = { [addedProduct.id]: updatedOrNewCartItem };
        state.totalAmount = state.totalAmount + productPrice;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const selectedCartItem = state.items[action.payload];
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
        updatedCartItems = {
          ...state.items,
          [action.payload]: updatedCartItem,
        };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.payload];
      }
      state.items = updatedCartItems;
      state.totalAmount = state.totalAmount - selectedCartItem.productPrice;
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
