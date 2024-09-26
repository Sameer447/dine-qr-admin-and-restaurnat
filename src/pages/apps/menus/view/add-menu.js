// ** Third Party Imports
"use client"
import React, { useEffect } from "react";
import MenuForm from "src/views/apps/menus/view/menuForm";

// ** Demo Components Imports

const AddMenu = () => {
  const [restaurantData, setRestaurantData] = React.useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
        setRestaurantData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRestaurantData();
  }, []);
  return <MenuForm restaurantData={restaurantData} />;
};

export default AddMenu;
