import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Order from '../models/order';
import CartItem, { Cart, CartDetails } from '../models/cart-item';
import Product, { DatabaseProduct } from '../models/product';

const transformDatabaseGetResponse = (response: DatabaseProduct) => {
  let transformedResponse: Product[] = [];

  for (const key in response) {
    transformedResponse.push({
      id: key,
      ownerId: response[key].ownerId,
      title: response[key].title,
      imageUrl: response[key].imageUrl,
      description: response[key].description,
      price: response[key].price,
    });
  }
  return transformedResponse;
};

type PostResponse = {
  name: string;
};

type UpdateProductQueryParams = {
  /** The Unique ID of the product in firebase */
  id: string;
  /** The product details you want to update */
  product: Partial<Product>;
};

type UpdateCartQueryParams = {
  /** The Unique ID of the cart in firebase */
  cartId: string;
  /** The cart item details you want to add to the cart */
  cartItem: Partial<CartItem>;
};

export const firebaseApi = createApi({
  reducerPath: 'firebaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://shop-app-6a103-default-rtdb.firebaseio.com/',
  }),
  tagTypes: ['UserProduct', 'Cart'],
  endpoints: (build) => ({
    createProduct: build.mutation<PostResponse, Omit<Product, 'id'>>({
      query: (product) => ({
        url: 'products.json',
        method: 'POST',
        body: product,
      }),
    }),
    fetchAllProducts: build.query<Product[], void>({
      query: () => ({
        url: 'products.json',
      }),
      transformResponse: (response: DatabaseProduct) =>
        transformDatabaseGetResponse(response),
    }),
    fetchOwnerProducts: build.query<Product[], string>({
      query: (ownerId) => ({
        url: `products.json?orderBy="ownerId"&equalTo="${ownerId}"`,
      }),
      providesTags: ['UserProduct'],
      transformResponse: (response: DatabaseProduct) => {
        return transformDatabaseGetResponse(response);
      },
    }),
    updateOwnerProduct: build.mutation<
      Partial<Product>,
      UpdateProductQueryParams
    >({
      query: ({ id, product }) => ({
        url: `products/${id}.json`,
        method: 'PATCH',
        body: product,
      }),
      invalidatesTags: ['UserProduct'],
    }),
    deleteOwnerProduct: build.mutation<null, string>({
      query: (id) => ({
        url: `products/${id}.json`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserProduct'],
    }),
    createOrder: build.mutation<PostResponse, Omit<Order, 'id'>>({
      query: (order) => ({
        url: 'orders.json',
        method: 'POST',
        body: order,
      }),
    }),
    createCart: build.mutation<PostResponse, Cart>({
      query: ({ ownerId, cart }) => ({
        url: `carts/${ownerId}.json`,
        method: 'PUT',
        body: cart,
      }),
      invalidatesTags: ['Cart'],
    }),
    fetchCart: build.query<CartDetails, string>({
      query: (ownerId) => ({
        url: `carts/${ownerId}.json"`,
      }),
      providesTags: ['Cart'],
    }),
    updateCart: build.mutation<Partial<CartItem>, UpdateCartQueryParams>({
      query: ({ cartId, cartItem }) => ({
        url: `carts/${cartId}.json`,
        method: 'PUT',
        body: cartItem,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useFetchAllProductsQuery,
  useFetchOwnerProductsQuery,
  useUpdateOwnerProductMutation,
  useDeleteOwnerProductMutation,
  useCreateOrderMutation,
  useCreateCartMutation,
  useFetchCartQuery,
  useUpdateCartMutation,
} = firebaseApi;
