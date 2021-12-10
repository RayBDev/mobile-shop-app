import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';

const EditProductScreen = () => {
  const { t } = useTheme();

  return (
    <View>
      <Text>The Edit Products Screen!</Text>
    </View>
  );
};

export default EditProductScreen;
