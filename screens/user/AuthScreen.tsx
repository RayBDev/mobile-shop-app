import React, { useState, useReducer, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { lightColors, useTheme } from '../../theme';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ShopButton from '../../components/ui/ShopButton';
import { useSignInMutation, useSignUpMutation } from '../../services/authApi';
import { authErrorResponse, signUpResponse } from '../../models/auth';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { saveToSecureStore } from '../../store/slices/authSlice';

type FormState = {
  inputValues: {
    email: string;
    password: string;
  };
  inputValidities: {
    email: boolean;
    password: boolean;
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

    let key: 'email' | 'password';

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

const AuthScreen = () => {
  const { t } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useAppDispatch();
  const secureStoreIsLoading = useAppSelector((state) => state.auth.isLoading);

  const [
    signUpDatabase,
    {
      data: signUpResponseData,
      isLoading: isLoadingSignUp,
      isError: isErrorSigningUp,
      isSuccess: isSignUpSuccess,
      error: signUpErrorMessage,
    },
  ] = useSignUpMutation();

  const [
    signInDatabase,
    {
      data: signInResponseData,
      isLoading: isLoadingSignIn,
      isError: isErrorSigningIn,
      isSuccess: isSignInSuccess,
      error: signInErrorMessage,
    },
  ] = useSignInMutation();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

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

  const authHandler = () => {
    if (isSignUp) {
      signUpDatabase({
        email: formState.inputValues.email,
        password: formState.inputValues.password,
        returnSecureToken: true,
      });
    } else {
      signInDatabase({
        email: formState.inputValues.email,
        password: formState.inputValues.password,
        returnSecureToken: true,
      });
    }
  };

  useEffect(() => {
    if (signUpResponseData && isSignUpSuccess) {
      dispatch(
        saveToSecureStore({
          userToken: signUpResponseData.idToken,
          ownerId: signUpResponseData.localId,
          tokenExpiry: new Date(
            new Date().getTime() + parseInt(signUpResponseData.expiresIn) * 1000
          ).toISOString(),
        })
      );
    }
  }, [isSignUpSuccess, signUpResponseData]);

  useEffect(() => {
    if (signInResponseData && isSignInSuccess) {
      dispatch(
        saveToSecureStore({
          userToken: signInResponseData.idToken,
          ownerId: signInResponseData.localId,
          tokenExpiry: new Date(
            new Date().getTime() + parseInt(signInResponseData.expiresIn) * 1000
          ).toISOString(),
        })
      );
    }
  }, [isSignInSuccess, signInResponseData]);

  useEffect(() => {
    let message = 'Something went wrong!';
    if (signInErrorMessage && !isSignUp) {
      let signInError = (signInErrorMessage as authErrorResponse)?.data.error
        .message;
      if (
        signInError === 'EMAIL_NOT_FOUND' ||
        signInError === 'INVALID_PASSWORD'
      ) {
        message = 'Login credentials could not be verified';
      }
      Alert.alert(`Sign In Failed`, message, [{ text: 'Okay' }]);
    } else if (signUpErrorMessage && isSignUp) {
      let signUpError = (signUpErrorMessage as authErrorResponse)?.data.error
        .message;

      if (signUpError === 'EMAIL_EXISTS') {
        message = 'This email already exists. Please log in instead.';
      }

      if (signUpError === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        message =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
      }
      Alert.alert(`Sign Up Failed`, message, [{ text: 'Okay' }]);
    }
  }, [signInErrorMessage, signUpErrorMessage]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={[t.flex1, t.justifyCenter, t.itemsCenter, t.bgGray300]}
    >
      <Card style={[t.w4_5, t.maxW96, t.maxH96, t.p5]}>
        <ScrollView>
          <Input
            id="email"
            label="Email"
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            errorMessage="Please enter a valid email address."
            onInputChange={inputChangeHandler}
            initialValue=""
            initiallyValid
          />
          <Input
            id="password"
            label="Password"
            secureTextEntry
            required
            minLength={5}
            autoCapitalize="none"
            errorMessage="Please enter a valid password."
            onInputChange={inputChangeHandler}
            initialValue=""
            initiallyValid
          />
        </ScrollView>
        <View style={[t.mT2]}>
          {!isLoadingSignUp && !isLoadingSignIn && !secureStoreIsLoading ? (
            <ShopButton
              title={isSignUp ? 'Sign Up' : 'Login'}
              onPress={authHandler}
            />
          ) : (
            <View style={[t.flex1, t.justifyCenter, t.itemsCenter]}>
              <ActivityIndicator size="small" color={lightColors.primary} />
            </View>
          )}
        </View>
        <View style={[t.mT2]}>
          <ShopButton
            title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
            color="secondary"
            onPress={() => {
              setIsSignUp((prevState) => !prevState);
            }}
          />
        </View>
      </Card>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
