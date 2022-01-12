import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loginDetails, signInResponse, signUpResponse } from '../models/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://identitytoolkit.googleapis.com/v1/',
  }),
  endpoints: (build) => ({
    signUp: build.mutation<signUpResponse, loginDetails>({
      query: (loginDetails) => ({
        url: 'accounts:signUp?key=AIzaSyD98z0N20OAULV126-GbLA2kCxp--TysNU',
        method: 'POST',
        body: loginDetails,
      }),
    }),
    signIn: build.mutation<signInResponse, loginDetails>({
      query: (loginDetails) => ({
        url: 'accounts:signInWithPassword?key=AIzaSyD98z0N20OAULV126-GbLA2kCxp--TysNU',
        method: 'POST',
        body: loginDetails,
      }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
