import React, { PropsWithChildren } from 'react';
import { StyleSheet, ViewProps, View } from 'react-native';
import { useTheme } from '../../theme';

const Card = ({ children, style }: PropsWithChildren<ViewProps>) => {
  const { t } = useTheme();
  return (
    <View
      style={StyleSheet.compose(style, [
        t.shadow2xl,
        t.roundedSm,
        t.bgPrimaryContrast,
      ])}
    >
      {children}
    </View>
  );
};

export default Card;
