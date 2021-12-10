import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

/** Product ID string */
type ProductId = string;

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    deleteProduct: (state, action: PayloadAction<ProductId>) => {
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.payload
        ),
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.payload
        ),
      };
    },
  },
});

export const { deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
