import { AnyAction } from 'redux';
import Order from '../../models/order';
import { ADD_ORDER } from '../actions/orders';

type InitialState = {
  orders: Order[];
};

const initialState: InitialState = {
  orders: [],
};

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ADD_ORDER:
      const newOrder = new Order(
        new Date().toString(),
        action.orderData.items,
        action.orderData.amount,
        new Date()
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };
  }
  return state;
};
