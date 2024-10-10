const navigation = (role) => {
  return [
    {
      title: "Dashboards",
      icon: "tabler:smart-home",
      children: [
        !role
          ? {
              title: "Orders",
              path: "/dashboards/orders/list",
            }
          : {
              title: "Restaurants",
              icon: "tabler:home",
              path: "/dashboards/restaurants/list",
            },
      ].filter(Boolean), 
    },
    // !role && {
    //   title: "Invoice",
    //   icon: "tabler:file-dollar",
    //   children: [
    //     {
    //       title: "List",
    //       path: "/apps/invoice/list",
    //     },
    //     {
    //       title: "Preview",
    //       path: "/apps/invoice/preview",
    //     },
    //   ],
    // },
    !role && {
      title: "Qr Code",
      icon: "tabler:qrcode",
      children: [
        {
          title: "View",
          path: "/apps/qr-code/view",
        },
      ],
    },
    !role && {
      title: "Menu",
      icon: "tabler:menu-2",
      children: [
        {
          title: "List",
          path: "/apps/menus/list",
        },
        {
          title: "View",
          children: [
            {
              title: "Add Menu Item",
              path: "/apps/menus/view/add-menu-item",
            },
          ],
        },
      ],
    },
  ].filter(Boolean);
};

export default navigation;
