import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';
import ShopButton from '../ui/ShopButton';
import CartItem from './CartItem';
import CartItemModel from '../../models/cart-item';

type Props = {
  /** Total dollar amount of order */
  amount: number;
  /** Preformatted date as a string */
  date: string;
  /** CartItem array to display cart details */
  items: CartItemModel[];
};

const OrderItem = ({ amount, date, items }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const { t } = useTheme();

  return (
    <View
      style={[
        t.shadow2xl,
        t.roundedSm,
        t.bgPrimaryContrast,
        t.m5,
        t.p2,
        t.itemsCenter,
      ]}
    >
      <View
        style={[t.flexRow, t.justifyBetween, t.itemsCenter, t.wFull, t.mB4]}
      >
        <Text style={[t.fontSansBold, t.textBase]}>${amount.toFixed(2)}</Text>
        <Text style={[t.fontSans, t.textSm, t.textGray800]}>{date}</Text>
      </View>
      <ShopButton
        title={showDetails ? 'Hide Details' : 'Show Details'}
        onPress={() => {
          setShowDetails((prevState) => !prevState);
        }}
      />
      {showDetails && (
        <View style={[t.wFull]}>
          {items.map((cartItem) => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.sum}
              title={cartItem.productTitle}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default OrderItem;
