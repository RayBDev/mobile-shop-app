/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Navigator Param Types
export type RootStackParamList = {
  Auth: undefined;
  Root: undefined;
  EditProduct:
    | {
        productId: string;
        ownerId: string | null;
      }
    | undefined;
  NotFound: undefined;
};

export type ProductsStackParamList = {
  ProductsOverview: { ownerId: string | null };
  ProductDetail: {
    productId: string;
    productTitle: string;
  };
  Cart: { ownerId: string | null };
};

export type OrdersStackParamList = {
  OrdersOverview: { ownerId: string | null };
};

export type UserProductsStackParamList = {
  UserProductsOverview: { ownerId: string | null };
};

export type RootDrawerParamList = {
  Products: { ownerId: string | null };
  Orders: { ownerId: string | null };
  UserProducts: { ownerId: string | null };
};

// Navigator Prop Types
export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type ProductsStackScreenProps<
  Screen extends keyof ProductsStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<ProductsStackParamList, Screen>,
  DrawerScreenProps<RootDrawerParamList>
>;

export type OrdersStackScreenProps<Screen extends keyof OrdersStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OrdersStackParamList, Screen>,
    DrawerScreenProps<RootDrawerParamList>
  >;

export type UserProductsStackScreenProps<
  Screen extends keyof UserProductsStackParamList
> = CompositeScreenProps<
  CompositeScreenProps<
    NativeStackScreenProps<UserProductsStackParamList, Screen>,
    DrawerScreenProps<RootDrawerParamList>
  >,
  NativeStackScreenProps<RootStackParamList>
>;

export type RootDrawerScreenProps<Screen extends keyof RootDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
