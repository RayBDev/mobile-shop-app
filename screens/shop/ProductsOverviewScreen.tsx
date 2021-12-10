import React from 'react';
import { FlatList } from 'react-native';

import ProductItem from '../../components/shop/ProductItem';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { addToCart } from '../../store/slices/cartSlice';
import { ProductsStackScreenProps } from '../../types';
import ShopButton from '../../components/ui/ShopButton';

const ProductsOverviewScreen = ({
  navigation,
}: ProductsStackScreenProps<'ProductsOverview'>) => {
  const products = useAppSelector((state) => state.products.availableProducts);
  const dispatch = useAppDispatch();

  const selectItemHandler = (productId: string, productTitle: string) => {
    navigation.navigate('ProductDetail', {
      productId,
      productTitle,
    });
  };

  return (
    <FlatList
      data={products}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() =>
            selectItemHandler(itemData.item.id, itemData.item.title)
          }
        >
          <ShopButton
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <ShopButton
            title="To Cart"
            onPress={() => {
              dispatch(addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

export default ProductsOverviewScreen;
