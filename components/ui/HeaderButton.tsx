import React from 'react';
import {
  HeaderButton,
  HeaderButtonProps,
} from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

const CustomHeaderButton = (props: HeaderButtonProps) => {
  const { t } = useTheme();
  return <HeaderButton {...props} IconComponent={Ionicons} iconSize={23} />;
};

export default CustomHeaderButton;
