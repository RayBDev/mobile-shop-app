import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';

const Navigation = () => {
  const { navTheme } = useTheme();
  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { t } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: t.fontSansBold,
        headerBackTitleStyle: t.fontSans,
      }}
    >
      <Stack.Screen
        name="ProductsOverview"
        component={ProductsOverviewScreen}
        options={{ headerTitle: 'All Products' }}
      />
      <Stack.Screen name="ProductDetail" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
