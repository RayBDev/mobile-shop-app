import React from 'react';
import { FlatList } from 'react-native';

import ProductItem from '../../components/shop/ProductItem';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { ProductsStackScreenProps } from '../../types';
import * as cartActions from '../../store/actions/cart';

const ProductsOverviewScreen = ({
  navigation,
}: ProductsStackScreenProps<'ProductsOverview'>) => {
  const products = useAppSelector((state) => state.products.availableProducts);
  const dispatch = useAppDispatch();

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
          onAddToCart={() => {
            dispatch(cartActions.addToCart(itemData.item));
          }}
        />
      )}
    />
  );
};

export default ProductsOverviewScreen;
