import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Replace with your actual backend URL
// Examples:
// Local: http://192.168.100.20:8080 (add your port)
// Production: https://api.example.com
const API_BASE_URL = 'http://192.168.100.20:8080'; // ⚠️ UPDATE THIS WITH YOUR ACTUAL SERVER!

interface QueryParams {
  url: string;
  params?: Record<string, any>;
}

interface MutationParams {
  url: string;
  data?: any;
}

// Helper function to get token
const getToken = async () => {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    // GET - Fetch data with custom URL and params
    // const {data, isLoading, isError} = useGetQuery({url: "/items", params: {}})
    get: builder.query<any, QueryParams>({
      query: ({ url, params }) => ({
        url,
        params,
      }),
    }),

    // Lazy GET - Load on demand with custom URL and params
    // const [trigger] = useLazyGetQuery()
    // trigger({url: "/items", params: {}})
    lazyGet: builder.query<any, QueryParams>({
      query: ({ url, params }) => ({
        url,
        params,
      }),
    }),

    // CREATE - Post data to custom URL
    // const [mutate] = useCreateMutation()
    // mutate({url: "/items", data: {...}})
    create: builder.mutation<any, MutationParams>({
      query: ({ url, data }) => ({
        url,
        method: 'POST',
        body: data,
      }),
    }),

    // UPDATE - Update data at custom URL
    // const [mutate] = useUpdateMutation()
    // mutate({url: "/items?id=eq.1", data: {...}})
    update: builder.mutation<any, MutationParams>({
      query: ({ url, data }) => ({
        url,
        method: 'PATCH',
        body: data,
      }),
    }),

    // DELETE - Delete data at custom URL
    // const [mutate] = useDeleteMutation()
    // mutate({url: "/items?id=eq.1"})
    delete: builder.mutation<any, string>({
      query: (url) => ({
        url,
        method: 'DELETE',
      }),
    }),

    // LOGIN - User login
    // const [mutate] = useLoginMutation()
    // mutate({email: "user@example.com", password: "password"})
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/api/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // REGISTER - User registration
    // const [mutate] = useRegisterMutation()
    // mutate({email: "user@example.com", password: "password", name: "John"})
    register: builder.mutation<any, { email: string; password: string; [key: string]: any }>({
      query: (userData) => ({
        url: '/api/users/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const {
  useGetQuery,
  useLazyGetQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLoginMutation,
  useRegisterMutation,
} = api;
