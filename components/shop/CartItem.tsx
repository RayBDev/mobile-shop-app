import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../theme';

type Props = {
  /** Quantity of item in cart */
  quantity: number;
  /** Title of item in cart */
  title: string;
  /** Dollar value amount of item in cart */
  amount: number;
  /** Function called onPress */
  onRemove?: () => void;
};

const CartItem = ({ quantity, title, amount, onRemove }: Props) => {
  const { t } = useTheme();

  return (
    <View style={[t.p3, t.flexRow, t.justifyBetween, t.mX5]}>
      <View style={[t.flexRow, t.itemsCenter]}>
        <Text style={[t.fontSans, t.textGray800, t.textBase, t.mR2]}>
          {quantity}{' '}
        </Text>
        <Text style={[t.fontSansBold, t.textBase, t.maxW36]}>{title}</Text>
      </View>
      <View style={[t.flexRow, t.itemsCenter]}>
        <Text style={[t.fontSansBold, t.textBase]}>${amount.toFixed(2)}</Text>
        {onRemove && (
          <TouchableOpacity onPress={onRemove} style={[t.mL3]}>
            <Ionicons
              name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
              size={23}
              color="red"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CartItem;
