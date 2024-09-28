// ** Third Party Imports
"use client";
import React, { useEffect } from "react";
import AddMenuItemForm from "src/views/apps/menus/view/AddMenu";

const AddMenu = () => {
  const [restaurantData, setRestaurantData] = React.useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = localStorage.getItem("userData")
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
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
