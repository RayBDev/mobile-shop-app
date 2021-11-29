import React from 'react';
import { ScrollView, Text, View, Button, Image } from 'react-native';
import { RootStackScreenProps } from '../../types';

import { useAppSelector } from '../../hooks/reduxHooks';
import { useTheme } from '../../theme';
import ShopButton from '../../components/ui/ShopButton';

const ProductDetailsScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'ProductDetail'>) => {
  const { t } = useTheme();
  const { productId, productTitle } = route.params;
  const selectedProduct = useAppSelector((state) =>
    state.products.availableProducts.find((product) => product.id === productId)
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: productTitle,
    });
  }, [productTitle]);

  return (
    <ScrollView>
      <Image
        style={[t.wFull, t.h75]}
        source={{ uri: selectedProduct?.imageUrl }}
      />
      <View style={[t.mY3, t.itemsCenter]}>
        <ShopButton title="Add To Cart" onPress={() => {}} />
      </View>
      <Text
        style={[t.textLg, t.textGray500, t.textCenter, t.mY5, t.fontSansBold]}
      >
        ${selectedProduct?.price.toFixed(2)}
      </Text>
      <Text style={[t.textSm, t.textCenter, t.mX5, t.fontSans]}>
        {selectedProduct?.description}
      </Text>
    </ScrollView>
  );
};

export default ProductDetailsScreen;
