// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
const serviceUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;

// ** Fetch Orders
export const fetchOrdersData = createAsyncThunk(
  "appOrders/fetchOrdersData",
  async () => {
    const user = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null;
    if (!user) return;
    const response = await axios.get(
      `${serviceUrl}/get-orders?restaurant_id=${user._id}`,
    );
    console.log("response", response);

    return response.data;
  },
);

// ** Add Restaurant
export const addOrder = createAsyncThunk(
  "appOrders/addOrder",
  async (data, { getState, dispatch }) => {
    const response = await axios.post("/apps/users/add-user", {
      data,
    });
    dispatch(fetchData(getState().user.params));

    return response.data;
  },
);

// ** Delete Restaurant
export const deleteOrder = createAsyncThunk(
  "appOrders/deleteOrder",
  async (id, { getState, dispatch }) => {
    const response = await axios.delete("/apps/users/delete", {
      data: id,
    });
    dispatch(fetchData(getState().user.params));

    return response.data;
  },
);

export const appOrdersSlice = createSlice({
  name: "appOrders",
  initialState: {
    orders: [], // Array to store restaurant data
    foodItems: [], // Array to store food items data
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrdersData.fulfilled, (state, action) => {
      state.orders = action.payload.data; // Store fetched restaurant data
    });
  },
});

export default appOrdersSlice.reducer;
