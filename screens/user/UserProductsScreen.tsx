import React from 'react';
import { Alert, FlatList } from 'react-native';

import ProductItem from '../../components/shop/ProductItem';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import ShopButton from '../../components/ui/ShopButton';
import { deleteProduct } from '../../store/slices/productsSlice';
import { UserProductsStackScreenProps } from '../../types';

const UserProductsScreen = ({
  navigation,
}: UserProductsStackScreenProps<'UserProductsOverview'>) => {
  const userProducts = useAppSelector((state) => state.products.userProducts);
  const dispatch = useAppDispatch();

  const editProductHandler = (productId: string) => {
    navigation.navigate('EditProduct', {
      productId,
    });
  };

  const deleteHandler = (id: string) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteProduct(id));
        },
      },
    ]);
  };

  return (
    <FlatList
      data={userProducts}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <ShopButton
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <ShopButton
            title="Delete"
            onPress={() => {
              deleteHandler(itemData.item.id);
            }}
          />
        </ProductItem>
      )}
    />
  );
};

export default UserProductsScreen;
