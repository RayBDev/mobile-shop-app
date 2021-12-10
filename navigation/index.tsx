import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, Text } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import {
  OrdersStackParamList,
  ProductsStackParamList,
  RootDrawerParamList,
  RootStackParamList,
  ProductsStackScreenProps,
  OrdersStackScreenProps,
  UserProductsStackParamList,
  UserProductsStackScreenProps,
  RootStackScreenProps,
} from '../types';
import { useTheme } from '../theme';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';
import LinkingConfiguration from './LinkingConfiguration';
import NotFoundScreen from '../screens/NotFoundScreen';
import CustomHeaderButton from '../components/ui/HeaderButton';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';

const Navigation = () => {
  const { navTheme } = useTheme();
  return (
    <NavigationContainer
      theme={navTheme}
      linking={LinkingConfiguration}
      fallback={<Text>Loading...</Text>}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();
const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const UserProductsStack =
  createNativeStackNavigator<UserProductsStackParamList>();

const RootNavigator = () => {
  const { t } = useTheme();
  return (
    <RootStack.Navigator
      screenOptions={{
        headerTitleStyle: t.fontSansBold,
        headerBackTitleStyle: t.fontSans,
      }}
    >
      <RootStack.Screen
        name="Root"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={() => ({
          title: 'Edit Product',
        })}
      />
      <RootStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
    </RootStack.Navigator>
  );
};

const ProductsNavigator = () => {
  return (
    <ProductsStack.Navigator>
      <ProductsStack.Screen
        name="ProductsOverview"
        component={ProductsOverviewScreen}
        options={({
          navigation,
        }: ProductsStackScreenProps<'ProductsOverview'>) => ({
          title: 'All Products',
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Menu"
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Cart"
                iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                onPress={() => {
                  navigation.navigate('Cart');
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
      <ProductsStack.Screen
        name="ProductDetail"
        component={ProductDetailsScreen}
        options={({ route }) => ({ title: route.params.productTitle })}
      />
      <ProductsStack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Your Cart' }}
      />
    </ProductsStack.Navigator>
  );
};

const OrdersNavigator = () => {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="OrdersOverview"
        component={OrdersScreen}
        options={({
          navigation,
        }: OrdersStackScreenProps<'OrdersOverview'>) => ({
          title: 'Your Orders',
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Menu"
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
    </OrdersStack.Navigator>
  );
};

const UserProductsNavigator = () => {
  return (
    <UserProductsStack.Navigator>
      <UserProductsStack.Screen
        name="UserProductsOverview"
        component={UserProductsScreen}
        options={({
          navigation,
        }: UserProductsStackScreenProps<'UserProductsOverview'>) => ({
          title: 'Your Products',
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Menu"
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Add"
                iconName={
                  Platform.OS === 'android' ? 'md-create' : 'ios-create'
                }
                onPress={() => {
                  navigation.navigate('EditProduct');
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
    </UserProductsStack.Navigator>
  );
};

const DrawerNavigator = () => {
  const { t } = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleStyle: t.fontSansBold,
      }}
    >
      <Drawer.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          headerShown: false,
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={drawerConfig.color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          title: 'Your Orders',
          headerShown: false,
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
              size={23}
              color={drawerConfig.color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="UserProducts"
        component={UserProductsNavigator}
        options={{
          title: 'Admin',
          headerShown: false,
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
              size={23}
              color={drawerConfig.color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default Navigation;
