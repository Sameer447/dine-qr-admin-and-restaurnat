// ** Third Party Imports
"use client";
import React, { useEffect } from "react";
import AddMenuItemForm from "src/views/apps/menus/view/AddMenu";

// ** Demo Components Imports

// const response = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
// console.logO("response", response);

const AddMenu = () => {
  const [restaurantData, setRestaurantData] = React.useState(null);

  useEffect(() => {
    // Fetch restaurant data
    const fetchRestaurantData = async () => {
      try {
        const response = localStorage.getItem("userData")
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
        // const data = response.restaurantData.;
        setRestaurantData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRestaurantData();
  }, []);
  return <AddMenuItemForm restaurantData={restaurantData} />;
};

export default AddMenu;
