import React, { useEffect } from 'react';
import { Alert, FlatList, View, ActivityIndicator, Text } from 'react-native';

import ProductItem from '../../components/shop/ProductItem';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import ShopButton from '../../components/ui/ShopButton';
import { deleteProduct } from '../../store/slices/productsSlice';
import { UserProductsStackScreenProps } from '../../types';
import {
  useDeleteOwnerProductMutation,
  useFetchOwnerProductsQuery,
} from '../../services/firebaseApi';
import { useTheme, lightColors } from '../../theme';

const UserProductsScreen = ({
  route,
  navigation,
}: UserProductsStackScreenProps<'UserProductsOverview'>) => {
  const { t } = useTheme();
  const firebaseUserToken = useAppSelector((state) => state.auth.userToken);

  const {
    data: userProducts,
    isLoading: loadingOwnerProducts,
    isError: errorLoadingOwnerProducts,
    refetch,
  } = useFetchOwnerProductsQuery(route.params.ownerId!);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation]);

  const editProductHandler = (productId: string) => {
    navigation.navigate('EditProduct', {
      productId,
      ownerId: route.params.ownerId!,
    });
  };

  const [
    deleteProduct,
    { isLoading: deletingProduct, isError: deleteProductError },
  ] = useDeleteOwnerProductMutation();

  const deleteHandler = (id: string) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          // dispatch(deleteProduct(id));
          deleteProduct({ id, token: firebaseUserToken! });
        },
      },
    ]);
  };

  if (loadingOwnerProducts || deletingProduct) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <ActivityIndicator size="large" color={lightColors.primary} />
      </View>
    );
  }

  if (!loadingOwnerProducts && userProducts?.length === 0) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  if (errorLoadingOwnerProducts) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <Text>There was an error retrieving the products from the server.</Text>
        <ShopButton title="Try Again" onPress={refetch} />
      </View>
    );
  }

  if (deleteProductError) {
    Alert.alert('Delete Failed', 'Please try again', [{ text: 'Okay' }]);
  }

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
