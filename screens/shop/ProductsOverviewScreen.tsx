import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text } from 'react-native';

import ProductItem from '../../components/shop/ProductItem';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addToCart } from '../../store/slices/cartSlice';
import { ProductsStackScreenProps } from '../../types';
import ShopButton from '../../components/ui/ShopButton';
import {
  useCreateCartMutation,
  useFetchAllProductsQuery,
  useFetchCartQuery,
  useUpdateCartMutation,
} from '../../services/firebaseApi';
import { useTheme, lightColors } from '../../theme';
import CartItem, { CartItems } from '../../models/cart-item';
import productsSlice from '../../store/slices/productsSlice';
import Product from '../../models/product';

const ProductsOverviewScreen = ({
  navigation,
}: ProductsStackScreenProps<'ProductsOverview'>) => {
  // const products = useAppSelector((state) => state.products.availableProducts);
  const { t } = useTheme();
  const dispatch = useAppDispatch();
  const {
    data: allDatabaseProducts,
    isLoading: isLoadingAllProducts,
    isError: isErrorLoadingAllProducts,
    refetch,
  } = useFetchAllProductsQuery();

  const {
    data: allCartItemsByOwner,
    isLoading: isLoadingCart,
    isError: isErrorLoadingCart,
  } = useFetchCartQuery('u1');

  const [
    createCart,
    { isLoading: isCreatingCart, isError: isCartCreateError },
  ] = useCreateCartMutation();

  const [
    updateCart,
    { isLoading: isUpdatingCart, isError: isErrorUpdatingCart },
  ] = useUpdateCartMutation();

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
    if (!isLoadingCart && allCartItemsByOwner === null) {
      createCart({
        ownerId: 'u1',
        cart: {
          items: {
            [product.id]: {
              quantity: 1,
              productPrice: product.price,
              productTitle: product.title,
              sum: product.price,
            },
          },
          totalAmount: product.price,
        },
      });
    }
    if (!isLoadingCart && allCartItemsByOwner) {
      const updatedOrNewCartItem: CartItems = {
        [product.id]: {
          quantity: allCartItemsByOwner.items[product.id].quantity + 1,
          productPrice: product.price,
          productTitle: product.title,
          sum: allCartItemsByOwner.items[product.id].sum + product.price,
        },
      };

      updateCart({
        ownerId: 'u1',
        cart: {
          items: {
            ...allCartItemsByOwner.items,
            ...updatedOrNewCartItem,
          },
          totalAmount: product.price,
        },
      });
    }
  };

  if (isLoadingAllProducts || isLoadingCart || isCreatingCart || isUpdatingCart)
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
          <ShopButton
            title="To Cart"
            onPress={() => {
              // dispatch(addToCart(itemData.item));
              addToCartButtonHandler(itemData.item);
            }}
          />
        </ProductItem>
      )}
    />
  );
};

export default ProductsOverviewScreen;
