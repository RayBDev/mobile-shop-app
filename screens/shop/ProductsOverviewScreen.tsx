import React from 'react';
import { FlatList } from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useTheme } from '../../theme';
import { RootStackScreenProps } from '../../types';

const ProductsOverviewScreen = ({
  navigation,
}: RootStackScreenProps<'ProductsOverview'>) => {
  const products = useAppSelector((state) => state.products.availableProducts);
  const { t } = useTheme();

  return (
    <FlatList
      data={products}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onViewDetail={() =>
            navigation.navigate('ProductDetail', {
              productId: itemData.item.id,
              productTitle: itemData.item.title,
            })
          }
          onAddToCart={() => {}}
        />
      )}
    />
  );
};

export default ProductsOverviewScreen;
