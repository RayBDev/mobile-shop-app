import React from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';

import OrderItem from '../../components/shop/OrderItem';
import ShopButton from '../../components/ui/ShopButton';
import CartItem from '../../models/cart-item';
import { useFetchAllOwnerOrdersQuery } from '../../services/firebaseApi';
import { lightColors, useTheme } from '../../theme';
import { OrdersStackScreenProps } from '../../types';

const OrdersScreen = ({ route }: OrdersStackScreenProps<'OrdersOverview'>) => {
  const { t } = useTheme();
  // const orders = useAppSelector((state) => state.orders.orders);
  const {
    data: allOwnerOrders,
    isLoading: isLoadingOwnerOrders,
    isError: isErrorLoadingOwnerOrders,
    refetch: refetchOrders,
  } = useFetchAllOwnerOrdersQuery(route.params.ownerId);

  let transformedOrders = [];

  for (const key in allOwnerOrders) {
    let transformedCartItems: CartItem[] = [];

    for (const key2 in allOwnerOrders[key].items) {
      transformedCartItems.push({
        productId: key2,
        quantity: allOwnerOrders[key].items[key2].quantity,
        productPrice: allOwnerOrders[key].items[key2].productPrice,
        productTitle: allOwnerOrders[key].items[key2].productTitle,
        sum: allOwnerOrders[key].items[key2].sum,
      });
    }

    transformedOrders.push({
      id: key,
      items: transformedCartItems,
      totalAmount: allOwnerOrders[key].totalAmount,
      date: allOwnerOrders[key].date,
    });
  }

  if (isLoadingOwnerOrders) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <ActivityIndicator size="large" color={lightColors.primary} />
      </View>
    );
  }

  if (isErrorLoadingOwnerOrders) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <Text>There was an error retrieving your orders.</Text>
        <ShopButton title="Try Again" onPress={refetchOrders} />
      </View>
    );
  }

  return (
    <FlatList
      data={transformedOrders}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.date}
          items={itemData.item.items}
        />
      )}
    />
  );
};

export default OrdersScreen;
