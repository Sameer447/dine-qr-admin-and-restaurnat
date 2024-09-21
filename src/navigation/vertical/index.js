const navigation = (role) => {
  return [
    {
      title: "Dashboards",
      icon: "tabler:smart-home",
      // badgeContent: "new",
      // badgeColor: "error",
      children: [
        !role
          ? {
              title: "Orders",
              path: "/dashboards/orders/list",
            }
          : {
              title: "Restaurants",
              icon: "tabler:home",
              path: "/apps/restaurants/list",
            },
      ].filter(Boolean), // Filter out null values
    },
    // !role && {
    //   title: "Chat",
    //   icon: "tabler:messages",
    //   path: "/apps/chat",
    // },
    !role && {
      title: "Invoice",
      icon: "tabler:file-dollar",
      children: [
        {
          title: "List",
          path: "/apps/invoice/list",
        },
        {
          title: "Preview",
          path: "/apps/invoice/preview",
        },
      ],
    },
    !role && {
      title: "Menus",
      icon: "tabler:home",
      children: [
        {
          title: "List",
          path: "/apps/menus/list",
        },
        {
          title: "View",
          children: [
            {
              title: "Add Menu",
              path: "/apps/menus/view/add-menu",
            },
            {
              title: "Add Menu Item",
              path: "/apps/menus/view/add-menu-item",
            },
          ],
        },
      ],
    },
  ].filter(Boolean); // Filter out null values
};

export default navigation;
