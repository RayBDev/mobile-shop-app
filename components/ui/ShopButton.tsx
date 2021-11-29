import React from 'react';
import { Platform, Pressable, Text } from 'react-native';

import { useTheme } from '../../theme';

type Props = {
  title: string;
  onPress: () => void;
};

const ShopButton = ({ title, onPress }: Props) => {
  const { t } = useTheme();

  return (
    <Pressable
      style={Platform.select({
        ios: [t.justifyCenter, t.itemsCenter, t.pX3],
        android: [
          t.justifyCenter,
          t.itemsCenter,
          t.pY2,
          t.pX3,
          t.roundedSm,
          t.bgPrimary,
        ],
      })}
      onPress={onPress}
    >
      <Text
        style={Platform.select({
          ios: [t.textSm, t.textPrimary],
          android: [t.textSm, t.textPrimaryContrast],
        })}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default ShopButton;
