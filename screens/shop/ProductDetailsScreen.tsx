import React from 'react';
import { ScrollView, Text, View, Image, ActivityIndicator } from 'react-native';
import { ProductsStackScreenProps } from '../../types';

import { useAppDispatch } from '../../hooks/reduxHooks';
import { useTheme, lightColors } from '../../theme';
import ShopButton from '../../components/ui/ShopButton';
import { addToCart } from '../../store/slices/cartSlice';
import { useFetchAllProductsQuery } from '../../services/firebaseApi';

const ProductDetailsScreen = ({
  route,
}: ProductsStackScreenProps<'ProductDetail'>) => {
  const { t } = useTheme();
  const { productId } = route.params;
  // const selectedProduct = useAppSelector((state) =>
  //   state.products.availableProducts.find((product) => product.id === productId)
  // );
  const dispatch = useAppDispatch();
  const {
    data: allDatabaseProducts,
    isLoading,
    isError,
    refetch,
  } = useFetchAllProductsQuery();

  const selectedProduct = allDatabaseProducts?.find(
    (product) => product.id === productId
  );

  if (isLoading)
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <ActivityIndicator size="large" color={lightColors.primary} />
      </View>
    );

  if (isError) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <Text>There was an error retrieving the product details.</Text>
        <ShopButton title="Try Again" onPress={refetch} />
      </View>
    );
  }

  return (
    <ScrollView>
      <Image
        style={[t.wFull, t.h75]}
        source={{ uri: selectedProduct?.imageUrl }}
      />
      <View style={[t.mY3, t.itemsCenter]}>
        <ShopButton
          title="Add To Cart"
          onPress={() => {
            dispatch(addToCart(selectedProduct!));
          }}
        />
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
