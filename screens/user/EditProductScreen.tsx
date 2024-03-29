import React, { useCallback, useLayoutEffect, useReducer } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Notifications from 'expo-notifications';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { useTheme, lightColors } from '../../theme';
import { RootStackScreenProps } from '../../types';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import Input from '../../components/ui/Input';
import {
  useCreateProductMutation,
  useFetchOwnerProductsQuery,
  useUpdateOwnerProductMutation,
} from '../../services/firebaseApi';
import ShopButton from '../../components/ui/ShopButton';

export async function allowsNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

type FormState = {
  inputValues: {
    title: string;
    imageUrl: string;
    price: string;
    description: string;
  };
  inputValidities: {
    title: boolean;
    imageUrl: boolean;
    price: boolean;
    description: boolean;
  };
  formIsValid: boolean;
};

type FormAction = {
  type: 'FORM_INPUT_UPDATE';
  value: string;
  isValid: boolean;
  input: string;
};

const formReducer = (state: FormState, action: FormAction) => {
  if (action.type === 'FORM_INPUT_UPDATE') {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;

    let key: 'title' | 'imageUrl' | 'price' | 'description';

    for (key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const EditProductScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'EditProduct'>) => {
  const productId = route.params?.productId;
  const firebaseUserToken = useAppSelector((state) => state.auth.userToken);

  const {
    data: userProducts,
    isLoading: isFetching,
    isError: isErrorFetching,
    refetch,
  } = useFetchOwnerProductsQuery(route.params?.ownerId!);

  const editedProduct = userProducts?.find(
    (product) => product.id === productId
  );

  const [
    updateProduct,
    {
      isLoading: isUpdating,
      isError: isErrorUpdating,
      isSuccess: isSuccessUpdating,
    },
  ] = useUpdateOwnerProductMutation();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      price: '',
      description: editedProduct ? editedProduct.description : '',
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      price: editedProduct ? true : false,
      description: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  const { t } = useTheme();
  const dispatch = useAppDispatch();
  const [
    createProductInFirebase,
    {
      isLoading: isCreating,
      isError: isErrorCreating,
      isSuccess: isSuccessCreating,
    },
  ] = useCreateProductMutation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
            }
            onPress={async () => {
              if (!formState.formIsValid) {
                Alert.alert(
                  'Wrong Input!',
                  'Please check the errors in the form',
                  [{ text: 'Okay' }]
                );
                return;
              }
              if (editedProduct && productId) {
                updateProduct({
                  id: productId,
                  product: {
                    title: formState.inputValues.title,
                    description: formState.inputValues.description,
                    imageUrl: formState.inputValues.imageUrl,
                  },
                  token: firebaseUserToken!,
                });
              } else {
                // Check if we already have notification permission
                const notificationPermissionGranted =
                  await allowsNotificationsAsync();

                // Request notification permission if we don't have it
                let notificationPermissionStatus;
                if (!notificationPermissionGranted) {
                  notificationPermissionStatus =
                    await Notifications.requestPermissionsAsync();
                }

                // Set the push token based on the permission status
                let pushToken;
                if (notificationPermissionStatus?.status !== 'granted') {
                  pushToken = null;
                } else {
                  pushToken = (await Notifications.getExpoPushTokenAsync())
                    .data;
                }

                createProductInFirebase({
                  product: {
                    ownerId: route.params?.ownerId!,
                    title: formState.inputValues.title,
                    description: formState.inputValues.description,
                    imageUrl: formState.inputValues.imageUrl,
                    price: Number(formState.inputValues.price),
                    ownerPushToken: pushToken,
                  },
                  token: firebaseUserToken!,
                });
              }
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [dispatch, productId, formState]);

  const inputChangeHandler = useCallback(
    (inputIdentifier: string, inputValue: string, inputValidity: boolean) => {
      dispatchFormState({
        type: 'FORM_INPUT_UPDATE',
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  if (isFetching || isUpdating || isCreating)
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <ActivityIndicator size="large" color={lightColors.primary} />
      </View>
    );

  if (isSuccessUpdating || isSuccessCreating) {
    navigation.goBack();
  }

  if (isErrorFetching) {
    return (
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
        <Text>There was an error reaching the server</Text>
        <ShopButton title="Try Again" onPress={refetch} />
      </View>
    );
  }

  if (isErrorCreating || isErrorUpdating) {
    Alert.alert('Action Failed', 'Please try again', [{ text: 'Okay' }]);
  }

  return (
    <KeyboardAvoidingView
      style={[t.flex1]}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={[t.m5]}>
          <Input
            id="title"
            label="Title"
            errorMessage="Please enter a valid title!"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ''}
            initiallyValid={!!editedProduct}
            required
          />
          <Input
            id="imageUrl"
            label="Image Url"
            errorMessage="Please enter a valid image url!"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ''}
            initiallyValid={!!editedProduct}
            required
          />
          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              errorMessage="Please enter a valid price!"
              returnKeyType="next"
              keyboardType="decimal-pad"
              onInputChange={inputChangeHandler}
              initialValue={''}
              initiallyValid={false}
              required
              min={0.1}
            />
          )}
          <Input
            id="description"
            label="Description"
            errorMessage="Please enter a valid description!"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ''}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProductScreen;
