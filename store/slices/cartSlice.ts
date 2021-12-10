import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import CartItem from '../../models/cart-item';
import Product from '../../models/product';
import { deleteProduct } from './productsSlice';

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
      const productId = addedProduct.id;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;

      let updatedOrNewCartItem: CartItem;

      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        updatedOrNewCartItem = {
          productId,
          quantity: state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          sum: state.items[addedProduct.id].sum + productPrice,
        };

        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
          totalAmount: state.totalAmount + productPrice,
        };
      } else {
        updatedOrNewCartItem = {
          productId,
          quantity: 1,
          productPrice,
          productTitle,
          sum: productPrice,
        };
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
          totalAmount: state.totalAmount + productPrice,
        };
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
        const updatedCartItem = {
          productId: selectedCartItem.productId,
          quantity: selectedCartItem.quantity - 1,
          productPrice: selectedCartItem.productPrice,
          productTitle: selectedCartItem.productTitle,
          sum: selectedCartItem.sum - selectedCartItem.productPrice,
        };
        updatedCartItems = {
          ...state.items,
          [action.payload]: updatedCartItem,
        };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.payload];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase('orders/addOrder', () => {
      return initialState;
    });
    builder.addCase(deleteProduct, (state, action) => {
      if (!state.items[action.payload]) {
        return state;
      }
      const updatedItems = { ...state.items };
      const itemTotal = state.items[action.payload].sum;
      delete updatedItems[action.payload];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };
    });
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
