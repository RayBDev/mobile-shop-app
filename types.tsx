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
  Root: undefined;
  NotFound: undefined;
};

export type ProductsStackParamList = {
  ProductsOverview: undefined;
  ProductDetail: {
    productId: string;
    productTitle: string;
  };
  Cart: undefined;
};

export type OrdersStackParamList = {
  OrdersOverview: undefined;
};

export type RootDrawerParamList = {
  Products: undefined;
  Orders: undefined;
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

export type RootDrawerScreenProps<Screen extends keyof RootDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
