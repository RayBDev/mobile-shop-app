import React from 'react';
import { Text, View, FlatList } from 'react-native';

import ShopButton from '../../components/ui/ShopButton';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import CartItem from '../../models/cart-item';
import { useTheme } from '../../theme';
import CartItemComponent from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/orders';

const CartScreen = () => {
  const { t } = useTheme();
  const dispatch = useAppDispatch();

  const cartTotalAmount = useAppSelector((state) => state.cart.totalAmount);
  const cartItems = useAppSelector((state) => {
    type TransformedCartItem = { productId: string } & CartItem;
    const transformedCartItems: TransformedCartItem[] = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  return (
    <View style={[t.m5]}>
      <View
        style={[
          t.flexRow,
          t.itemsCenter,
          t.justifyBetween,
          t.mB5,
          t.p3,
          t.shadow2xl,
          t.roundedSm,
          t.bgPrimaryContrast,
        ]}
      >
        <Text style={[t.fontSansBold, t.textLg]}>
          Total:{' '}
          <Text style={[t.textSecondary]}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        <ShopButton
          title="Order Now"
          onPress={() => {
            dispatch(orderActions.addOrder(cartItems, cartTotalAmount));
          }}
          disabled={cartItems.length === 0}
        />
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItemComponent
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

export default CartScreen;
