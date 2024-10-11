// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

// ** Fetch Restaurants
export const fetchData = createAsyncThunk(
  "appRestaurants/fetchData",
  async () => {
    const response = await axios.get("/api/Restaurants/route");
    return response.data;
  },
);

// ** Fetch Restaurants
export const fetchMenuItems = createAsyncThunk(
  "appRestaurants/fetchMenuItems",
  async () => {
    const user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    if (!user) return;
    const response = await axios.get(`/api/get-food-items?restaurant_id=${user._id}`);
    return response.data;
  },
);


export const deleteMenuItems = createAsyncThunk(
  "appRestaurants/deleteMenuItems",
  async (id) => {
    const response = await axios.delete(`/api/del-food-items?id=${id}`);
    dispatch(fetchMenuItems());
    return response.data;
  },
);

// ** Add Restaurant
export const addRestaurant = createAsyncThunk(
  "appRestaurants/addRestaurant",
  async (data, { getState, dispatch }) => {
    const response = await axios.post("/apps/users/add-user", {
      data,
    });
    dispatch(fetchData(getState().user.params));

    return response.data;
  },
);

// ** Delete Restaurant
export const deleteRestaurant = createAsyncThunk(
  "appRestaurants/deleteRestaurant",
  async (id, { getState, dispatch }) => {
    const response = await axios.delete("/apps/users/delete", {
      data: id,
    });
    dispatch(fetchData(getState().user.params));

    return response.data;
  },
);

export const appRestaurantsSlice = createSlice({
  name: "appRestaurants",
  initialState: {
    restaurants: [],
    foodItems: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.restaurants = action.payload;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.foodItems = action.payload;
      })
      .addCase(deleteMenuItems.fulfilled, (state, action) => {
        state.foodItems = state.foodItems.filter((item) => item._id !== action.payload);
      });

  },
});

export default appRestaurantsSlice.reducer;
