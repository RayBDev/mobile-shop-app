import React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { RootStackScreenProps } from '../../types';

import { useAppSelector } from '../../hooks/reduxHooks';
import { useTheme } from '../../theme';
import ShopButton from '../../components/ui/ShopButton';

const ProductDetailsScreen = ({
  route,
}: RootStackScreenProps<'ProductDetail'>) => {
  const { t } = useTheme();
  const { productId } = route.params;
  const selectedProduct = useAppSelector((state) =>
    state.products.availableProducts.find((product) => product.id === productId)
  );

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
