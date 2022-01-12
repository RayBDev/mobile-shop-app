import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
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
import AuthScreen from '../screens/user/AuthScreen';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { getTokensFromSecureStore, signOut } from '../store/slices/authSlice';

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
  const dispatch = useAppDispatch();
  const userToken = useAppSelector((state) => state.auth.userToken);
  const ownerId = useAppSelector((state) => state.auth.ownerId);
  const tokenExpiry = useAppSelector((state) => state.auth.tokenExpiry);

  useEffect(() => {
    dispatch(getTokensFromSecureStore());
  }, []);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerTitleStyle: t.fontSansBold,
        headerBackTitleStyle: t.fontSans,
      }}
    >
      {!userToken || !tokenExpiry || new Date() > new Date(tokenExpiry) ? (
        <RootStack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerTitle: 'Authenticate' }}
        />
      ) : (
        <>
          <RootStack.Screen
            name="Root"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="EditProduct"
            component={EditProductScreen}
            initialParams={{ ownerId }}
            options={({ route }: RootStackScreenProps<'EditProduct'>) => ({
              headerTitle: route.params?.productId
                ? 'Edit Product'
                : 'Add Product',
            })}
          />
          <RootStack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: 'Oops!' }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
};

const ProductsNavigator = () => {
  const ownerId = useAppSelector((state) => state.auth.ownerId);
  return (
    <ProductsStack.Navigator>
      <ProductsStack.Screen
        name="ProductsOverview"
        component={ProductsOverviewScreen}
        initialParams={{ ownerId }}
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
                  navigation.navigate('Cart', { ownerId });
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
        initialParams={{ ownerId }}
        options={{ title: 'Your Cart' }}
      />
    </ProductsStack.Navigator>
  );
};

const OrdersNavigator = () => {
  const ownerId = useAppSelector((state) => state.auth.ownerId);
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="OrdersOverview"
        component={OrdersScreen}
        initialParams={{ ownerId }}
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
  const ownerId = useAppSelector((state) => state.auth.ownerId);
  return (
    <UserProductsStack.Navigator>
      <UserProductsStack.Screen
        name="UserProductsOverview"
        component={UserProductsScreen}
        initialParams={{ ownerId }}
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
  const dispatch = useAppDispatch();
  const ownerId = useAppSelector((state) => state.auth.ownerId);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleStyle: t.fontSansBold,
      }}
      initialRouteName="Products"
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Logout"
              onPress={() => {
                dispatch(signOut());
              }}
              icon={(drawerConfig) => (
                <Ionicons
                  name={
                    Platform.OS === 'android' ? 'md-log-out' : 'ios-log-out'
                  }
                  size={23}
                  color={drawerConfig.color}
                />
              )}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        name="Products"
        component={ProductsNavigator}
        initialParams={{ ownerId }}
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
        initialParams={{ ownerId }}
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
        initialParams={{ ownerId }}
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
