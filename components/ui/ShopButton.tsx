import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { useTheme } from '../../theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

const ShopButton = ({ title, onPress, disabled = false }: Props) => {
  const { t } = useTheme();

  return (
    <View style={[t.roundedSm, t.overflowHidden]}>
      <Pressable
        style={({ pressed }) =>
          Platform.select({
            ios: [
              t.justifyCenter,
              t.itemsCenter,
              t.pY2,
              t.pX3,
              pressed && t.opacity30,
            ],
            android: [
              t.justifyCenter,
              t.itemsCenter,
              t.pY2,
              t.pX3,
              disabled ? t.bgGray600 : t.bgPrimary,
            ],
          })
        }
        onPress={onPress}
        android_ripple={{ ...t.textPrimaryLight }}
        disabled={disabled}
      >
        <Text
          style={Platform.select({
            ios: [t.textSm, disabled ? t.textGray700 : t.textPrimary],
            android: [t.textSm, t.textPrimaryContrast],
          })}
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

export default ShopButton;
