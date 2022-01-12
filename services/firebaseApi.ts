import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Order, { AllOwnerOrders } from '../models/order';
import { Cart, CartDetails } from '../models/cart-item';
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

type AddProductMutationParams = {
  /** The product details you want to create */
  product: Omit<Product, 'id'>;
  /** The authentication token of the user */
  token: string;
};

type UpdateProductQueryParams = {
  /** The Unique ID of the product in firebase */
  id: string;
  /** The product details you want to update */
  product: Partial<Product>;
  /** The authentication token of the user */
  token: string;
};

type DeleteProductMutationParams = {
  /** The Unique ID of the product in firebase */
  id: string;
  /** The authentication token of the user */
  token: string;
};

type CreateOrderMutationParams = Omit<Order, 'id'> & {
  /** The authentication token of the user */
  token: string;
};

type UpdateCartMutationParams = Cart & {
  /** The authentication token of the user */
  token: string;
};

type DeleteCartMutationParams = {
  /** The id of the cart owner */
  ownerId: string;
  /** The authentication token of the user */
  token: string;
};

export const firebaseApi = createApi({
  reducerPath: 'firebaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://shop-app-6a103-default-rtdb.firebaseio.com/',
  }),
  tagTypes: ['UserProduct', 'Cart', 'Order'],
  endpoints: (build) => ({
    createProduct: build.mutation<PostResponse, AddProductMutationParams>({
      query: ({ product, token }) => ({
        url: `products.json?auth=${token}`,
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
      query: ({ id, product, token }) => ({
        url: `products/${id}.json?auth=${token}`,
        method: 'PATCH',
        body: product,
      }),
      invalidatesTags: ['UserProduct'],
    }),
    deleteOwnerProduct: build.mutation<null, DeleteProductMutationParams>({
      query: ({ id, token }) => ({
        url: `products/${id}.json?auth=${token}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserProduct'],
    }),
    createOrder: build.mutation<PostResponse, CreateOrderMutationParams>({
      query: ({ ownerId, order, token }) => ({
        url: `orders/${ownerId}.json?auth=${token}`,
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
    fetchAllOwnerOrders: build.query<AllOwnerOrders, string>({
      query: (ownerId) => ({
        url: `orders/${ownerId}.json`,
      }),
      providesTags: ['Order'],
    }),
    updateCartItem: build.mutation<CartDetails, UpdateCartMutationParams>({
      query: ({ ownerId, cart, token }) => ({
        url: `carts/${ownerId}.json?auth=${token}`,
        method: 'PUT',
        body: cart,
      }),
      invalidatesTags: ['Cart'],
    }),
    fetchCart: build.query<CartDetails, string>({
      query: (ownerId) => ({
        url: `carts/${ownerId}.json`,
      }),
      providesTags: ['Cart'],
    }),
    deleteCart: build.mutation<void, DeleteCartMutationParams>({
      query: ({ ownerId, token }) => ({
        url: `carts/${ownerId}.json?auth=${token}`,
        method: 'DELETE',
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
  useFetchAllOwnerOrdersQuery,
  useUpdateCartItemMutation,
  useFetchCartQuery,
  useDeleteCartMutation,
} = firebaseApi;
