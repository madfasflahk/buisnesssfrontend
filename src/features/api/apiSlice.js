import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'api/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    salePayment: builder.mutation({
      query: ({ customerId, ...paymentData }) => ({
        url: `api/salePayment/${customerId}`,
        method: 'POST',
        body: paymentData,
      }),
    }),
  }),
});

export const { useLoginMutation, useSalePaymentMutation } = apiSlice;