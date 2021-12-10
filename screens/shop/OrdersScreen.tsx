import React from 'react';
import { FlatList, Text } from 'react-native';

import OrderItem from '../../components/shop/OrderItem';
import { useAppSelector } from '../../hooks/reduxHooks';

const OrdersScreen = () => {
  const orders = useAppSelector((state) => state.orders.orders);
  return (
    <FlatList
      data={orders}
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
