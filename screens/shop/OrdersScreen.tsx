import React from 'react';
import { FlatList, Text } from 'react-native';
import { useAppSelector } from '../../hooks/reduxHooks';

const OrdersScreen = () => {
  const orders = useAppSelector((state) => state.orders.orders);
  return (
    <FlatList
      data={orders}
      renderItem={(itemData) => <Text>{itemData.item.totalAmount}</Text>}
    />
  );
};

export default OrdersScreen;
