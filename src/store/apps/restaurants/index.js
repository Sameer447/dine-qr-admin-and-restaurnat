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
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
      //   state.total = action.payload.total;
      //   state.params = action.payload.params;
      //   state.allData = action.payload.allData;
    });
  },
});

export default appRestaurantsSlice.reducer;
