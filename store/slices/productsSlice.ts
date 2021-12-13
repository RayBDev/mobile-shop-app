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
    createProduct: (
      state,
      action: PayloadAction<Omit<Product, 'id' | 'ownerId'>>
    ) => {
      const newProduct: Product = {
        id: new Date().toString(),
        ownerId: 'u1',
        title: action.payload.title,
        imageUrl: action.payload.imageUrl,
        description: action.payload.description,
        price: action.payload.price,
      };
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    },
    updateProduct: (
      state,
      action: PayloadAction<Omit<Product, 'ownerId' | 'price'>>
    ) => {
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.payload.id
      );
      const updatedProduct: Product = {
        id: action.payload.id,
        ownerId: state.userProducts[productIndex].ownerId,
        title: action.payload.title,
        imageUrl: action.payload.imageUrl,
        description: action.payload.description,
        price: state.userProducts[productIndex].price,
      };
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;

      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === action.payload.id
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };
    },
  },
});

export const { deleteProduct, createProduct, updateProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
