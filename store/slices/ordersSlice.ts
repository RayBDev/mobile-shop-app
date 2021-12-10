import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

import Order from '../../models/order';
import CartItem from '../../models/cart-item';

type InitialState = {
  orders: Order[];
};

const initialState: InitialState = {
  orders: [],
};

type Action = {
  cartItems: CartItem[];
  cartTotalAmount: number;
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Action>) => {
      const newOrder = {
        id: new Date().toString(),
        items: action.payload.cartItems,
        totalAmount: action.payload.cartTotalAmount,
        date: format(new Date(), 'MMM do yyyy, hh:mm aaa'),
      };

      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;
