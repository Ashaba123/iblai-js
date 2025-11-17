import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

// Create mock API slices that match the expected structure
const createMockApi = (reducerPath: string) =>
  createApi({
    reducerPath,
    baseQuery: vi.fn(),
    endpoints: () => ({}),
  });

const mentorApiSlice = createMockApi("mentorApiSlice");
const appApiSlice = createMockApi("appApiSlice");
const billingApiSlice = createMockApi("billingApiSlice");

// Create a mock store for Redux testing
const createMockStore = () =>
  configureStore({
    reducer: {
      // Add the API slices to prevent middleware warnings
      [mentorApiSlice.reducerPath]: mentorApiSlice.reducer,
      [appApiSlice.reducerPath]: appApiSlice.reducer,
      [billingApiSlice.reducerPath]: billingApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      })
        .concat(mentorApiSlice.middleware)
        .concat(appApiSlice.middleware)
        .concat(billingApiSlice.middleware),
  });

// Create a test wrapper component that provides Redux store
export const createWrapper = () => {
  const store = createMockStore();
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store, children });
};
