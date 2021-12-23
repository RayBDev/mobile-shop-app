import React from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';

import ShopButton from '../../components/ui/ShopButton';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import CartItem from '../../models/cart-item';
import { lightColors, useTheme } from '../../theme';
import CartItemComponent from '../../components/shop/CartItem';
import { addOrder } from '../../store/slices/ordersSlice';
import { removeFromCart } from '../../store/slices/cartSlice';
import Card from '../../components/ui/Card';
import {
  useCreateOrderMutation,
  useFetchCartQuery,
} from '../../services/firebaseApi';
import { ProductsStackScreenProps } from '../../types';

const CartScreen = ({ route }: ProductsStackScreenProps<'Cart'>) => {
  const { t } = useTheme();
  const dispatch = useAppDispatch();

  const cartTotalAmount = useAppSelector((state) => state.cart.totalAmount);

  const [
    createOrder,
    { isLoading: isCreatingOrder, isError: isErrorCreatingOrder },
  ] = useCreateOrderMutation();

  const {
    data: allCartItemsByOwner,
    isLoading: isLoadingCart,
    isError: isErrorLoadingCart,
    refetch: refetchCart,
  } = useFetchCartQuery(route.params.ownerId);

  // const cartItems = useAppSelector((state) => {
  //   type TransformedCartItem = CartItem;
  //   const transformedCartItems: TransformedCartItem[] = [];
  //   for (const key in state.cart.items) {
  //     transformedCartItems.push({
  //       productId: key,
  //       productTitle: state.cart.items[key].productTitle,
  //       productPrice: state.cart.items[key].productPrice,
  //       quantity: state.cart.items[key].quantity,
  //       sum: state.cart.items[key].sum,
  //     });
  //   }
  //   return transformedCartItems.sort((a, b) =>
  //     a.productId > b.productId ? 1 : -1
  //   );
  // });

  const cartItems = () => {
    const transformedCartItems: CartItem[] = [];
    if (allCartItemsByOwner) {
      for (const key in allCartItemsByOwner.items) {
        transformedCartItems.push({
          productId: key,
          productTitle: allCartItemsByOwner.items[key].productTitle,
          productPrice: allCartItemsByOwner.items[key].productPrice,
          quantity: allCartItemsByOwner.items[key].quantity,
          sum: allCartItemsByOwner.items[key].sum,
        });
        return transformedCartItems.sort((a, b) =>
          a.productId > b.productId ? 1 : -1
        );
      }
    }
  };

  if (isLoadingCart) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <ActivityIndicator size="large" color={lightColors.primary} />
      </View>
    );
  }

  if (isErrorLoadingCart) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <Text>There was an error retrieving your cart.</Text>
        <ShopButton title="Try Again" onPress={refetchCart} />
      </View>
    );
  }

  return (
    <View style={[t.m5]}>
      <Card style={[t.flexRow, t.itemsCenter, t.justifyBetween, t.mB5, t.p3]}>
        <Text style={[t.fontSansBold, t.textLg]}>
          Total:{' '}
          <Text style={[t.textSecondary]}>
            ${Math.round(Number(cartTotalAmount.toFixed(2)) * 100) / 100}
          </Text>
        </Text>
        <ShopButton
          title="Order Now"
          onPress={() => {
            // dispatch(addOrder({ cartItems, cartTotalAmount }));
          }}
          disabled={cartItems.length === 0}
        />
      </Card>
      <FlatList
        data={cartItems()}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItemComponent
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            onRemove={() => {
              dispatch(removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

export default CartScreen;
