import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';

import { useTheme } from '../../theme';
import Card from '../ui/Card';

type Props = {
  image: string;
  title: string;
  price: number;
  onSelect: () => void;
  /** Add your buttons as children */
  children: React.ReactNode;
};

const ProductItem = ({ image, title, price, onSelect, children }: Props) => {
  const { t } = useTheme();

  let TouchableCmp: typeof React.Component;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  } else {
    TouchableCmp = TouchableOpacity;
  }

  return (
    <Card style={[t.h75, t.m5]}>
      <View style={[t.overflowHidden, t.roundedSm]}>
        <TouchableCmp onPress={onSelect} useForeground>
          <View>
            <View style={[t.wFull, t.h3_5, t.roundedTSm, t.overflowHidden]}>
              <Image style={[t.wFull, t.hFull]} source={{ uri: image }} />
            </View>
            <View style={[t.itemsCenter, t.h3_20, t.pT2]}>
              <Text style={[t.textLg, t.fontSansBold]}>{title}</Text>
              <Text style={[t.textSm, t.textGray700, t.fontSans]}>
                ${price.toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                t.flexRow,
                t.justifyBetween,
                t.itemsCenter,
                t.h1_4,
                t.pX5,
              ]}
            >
              {children}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

export default ProductItem;
