import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

type Tokens = {
  /** The user token returned from Firebase after logging in */
  userToken: string | null;
  /** The owner ID returned from Firebase after logging in */
  ownerId: string | null;
  /** The number of seconds in which the ID token expires. */
  tokenExpiry: string | null;
};

type InitialState = {
  /** Is Loading the token from SecureStore */
  isLoading: boolean;
  /** User token returned from SecureStore */
  userToken: string | null;
  /** Owner ID returned from SecureStore */
  ownerId: string | null;
  /** The number of seconds in which the ID token expires. */
  tokenExpiry: string | null;
};

const initialState: InitialState = {
  isLoading: false,
  userToken: null,
  ownerId: null,
  tokenExpiry: null,
};

// SecureStore Thunks
export const saveToSecureStore = createAsyncThunk(
  'auth/saveToDevice',
  async (userData: Tokens) => {
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
    return userData;
  }
);

export const getTokensFromSecureStore = createAsyncThunk(
  'auth/getSecureStore',
  async () => {
    const userData = await SecureStore.getItemAsync('userData');
    return userData;
  }
);

export const signOut = createAsyncThunk('auth/clearStore', async () => {
  await SecureStore.deleteItemAsync('userData');
});

// Auth Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveToSecureStore.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(saveToSecureStore.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          userToken: action.payload.userToken,
          ownerId: action.payload.ownerId,
          tokenExpiry: action.payload.tokenExpiry,
        };
      })
      .addCase(getTokensFromSecureStore.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(getTokensFromSecureStore.fulfilled, (state, action) => {
        if (!action.payload) return { ...state, isLoading: false };
        const { userToken, ownerId, tokenExpiry }: Tokens = JSON.parse(
          action.payload
        );
        return {
          ...state,
          isLoading: false,
          userToken,
          ownerId,
          tokenExpiry,
        };
      })
      .addCase(signOut.fulfilled, () => {
        return initialState;
      });
  },
});

export default authSlice.reducer;
