// @ts-nocheck
// ** Third Party Imports
"use client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import AddMenuItemForm from "src/views/apps/menus/view/AddMenu";

const AddMenu = () => {
  const [restaurantData, setRestaurantData] = React.useState(null);
  const [menuData, setMenuData] = React.useState(null);
  const router = useRouter();
  const { id, data } = router.query;
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
    if (id) {
      setMenuData(JSON.parse(data));
    }
    fetchRestaurantData();
  }, [id]);
  return (
    <AddMenuItemForm restaurantData={restaurantData} menuData={menuData} />
  );
};

export default AddMenu;
