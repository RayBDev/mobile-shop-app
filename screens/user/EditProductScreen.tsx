import React, { useState, useLayoutEffect } from 'react';
import { Text, View, TextInput, ScrollView, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { useTheme } from '../../theme';
import { RootStackScreenProps } from '../../types';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import { createProduct, updateProduct } from '../../store/slices/productsSlice';

const EditProductScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'EditProduct'>) => {
  const productId = route.params?.productId;
  const editedProduct = useAppSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === productId)
  );

  const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
  const [imageUrl, setImageUrl] = useState(
    editedProduct ? editedProduct.imageUrl : ''
  );
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState(
    editedProduct ? editedProduct.description : ''
  );

  const { t } = useTheme();
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
            }
            onPress={() => {
              if (editedProduct && productId) {
                dispatch(
                  updateProduct({ id: productId, title, description, imageUrl })
                );
              } else {
                dispatch(
                  createProduct({
                    title,
                    description,
                    imageUrl,
                    price: Number(price),
                  })
                );
              }
              navigation.goBack();
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [dispatch, productId, title, description, imageUrl, price]);

  return (
    <ScrollView>
      <View style={[t.m5]}>
        <View style={[t.wFull]}>
          <Text style={[t.fontSansBold, t.mY2]}>Title</Text>
          <TextInput
            style={[t.pX0, t.pY1, t.borderGray400, t.borderB0_5]}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={[t.wFull]}>
          <Text style={[t.fontSansBold, t.mY2]}>Image URL</Text>
          <TextInput
            style={[t.pX0, t.pY1, t.borderGray400, t.borderB0_5]}
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
          />
        </View>
        {editedProduct ? null : (
          <View style={[t.wFull]}>
            <Text style={[t.fontSansBold, t.mY2]}>Price</Text>
            <TextInput
              style={[t.pX0, t.pY1, t.borderGray400, t.borderB0_5]}
              value={price}
              onChangeText={(text) => setPrice(text)}
            />
          </View>
        )}
        <View style={[t.wFull]}>
          <Text style={[t.fontSansBold, t.mY2]}>Description</Text>
          <TextInput
            style={[t.pX0, t.pY1, t.borderGray400, t.borderB0_5]}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProductScreen;
