import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text } from 'react-native';

import ProductItem from '../../components/shop/ProductItem';
import { ProductsStackScreenProps } from '../../types';
import ShopButton from '../../components/ui/ShopButton';
import {
  useUpdateCartItemMutation,
  useFetchAllProductsQuery,
  useFetchCartQuery,
} from '../../services/firebaseApi';
import { useTheme, lightColors } from '../../theme';
import { CartItems } from '../../models/cart-item';
import Product from '../../models/product';

const ProductsOverviewScreen = ({
  navigation,
}: ProductsStackScreenProps<'ProductsOverview'>) => {
  const { t } = useTheme();
  const {
    data: allDatabaseProducts,
    isLoading: isLoadingAllProducts,
    isError: isErrorLoadingAllProducts,
    isFetching: isFetchingAllProducts,
    refetch,
  } = useFetchAllProductsQuery();

  const {
    data: allCartItemsByOwner,
    isLoading: isLoadingCart,
    isError: isErrorLoadingCart,
    isSuccess: isSuccessGettingCart,
  } = useFetchCartQuery('u1');

  const [
    createCartItem,
    { isLoading: isCreatingCart, isError: isCartCreateError },
  ] = useUpdateCartItemMutation();

  const selectItemHandler = (productId: string, productTitle: string) => {
    navigation.navigate('ProductDetail', {
      productId,
      productTitle,
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation]);

  const addToCartButtonHandler = (product: Product) => {
    let updatedOrNewCartItem: CartItems = {};

    if (
      !isLoadingCart &&
      isSuccessGettingCart &&
      !allCartItemsByOwner?.items[product.id]
    ) {
      updatedOrNewCartItem = {
        [product.id]: {
          quantity: 1,
          productPrice: product.price,
          productTitle: product.title,
          sum: product.price,
        },
      };
    }
    if (
      !isLoadingCart &&
      isSuccessGettingCart &&
      allCartItemsByOwner?.items[product.id]
    ) {
      updatedOrNewCartItem = {
        [product.id]: {
          quantity: allCartItemsByOwner.items[product.id].quantity + 1,
          productPrice: product.price,
          productTitle: product.title,
          sum: allCartItemsByOwner.items[product.id].sum + product.price,
        },
      };
    }
    createCartItem({
      ownerId: 'u1',
      cart: {
        items: {
          ...allCartItemsByOwner?.items,
          ...updatedOrNewCartItem,
        },
        totalAmount: allCartItemsByOwner?.totalAmount
          ? allCartItemsByOwner.totalAmount + product.price
          : 0 + product.price,
      },
    });
  };

  if (isLoadingAllProducts)
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <ActivityIndicator size="large" color={lightColors.primary} />
      </View>
    );

  if (!isLoadingAllProducts && allDatabaseProducts?.length === 0) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  if (isErrorLoadingAllProducts) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <Text>There was an error retrieving the products from the server.</Text>
        <ShopButton title="Try Again" onPress={refetch} />
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={refetch}
      refreshing={isFetchingAllProducts}
      data={allDatabaseProducts}
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

          {isCreatingCart ? (
            <ActivityIndicator size="small" color={lightColors.primary} />
          ) : (
            <ShopButton
              title="To Cart"
              onPress={() => {
                // dispatch(addToCart(itemData.item));
                addToCartButtonHandler(itemData.item);
              }}
            />
          )}
        </ProductItem>
      )}
    />
  );
};

export default ProductsOverviewScreen;
