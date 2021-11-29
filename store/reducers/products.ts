import { AnyAction } from 'redux';

import PRODUCTS from '../../data/dummy-data';
import Product from '../../models/product';

type InitialState = {
  availableProducts: Product[];
  userProducts: Product[];
};

const initialState: InitialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((prod) => prod.ownerId === 'u1'),
};

export default (state = initialState, action: AnyAction) => {
  return state;
};
