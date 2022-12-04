export const routes = [
    {
      url: "/building-management", // the url
      path: "/building-management", // the pathname
      icon: "MdDashboard", // the component being exported from icons/index.js
      name: "Dashboard", // name that appear in Sidebar
    },
    {
      url: "/unit-management", // the url
      path: "/unit-management", // the pathname
      query: {
        page: 1,
        limit: 12,
      },
      icon: "MdHome", // the component being exported from icons/index.js
      name: "Unit List", // name that appear in Sidebar
    },
    {
      url: "/tenants", // the url
      path: "/tenants", // the pathname
      query: {
        page: 1,
        limit: 10,
      },
      icon: "MdPeople", // the component being exported from icons/index.js
      name: "Tenants", // name that appear in Sidebar
    },
    {
      url: "/parkings", // the url
      path: "/parkings", // the pathname
      query: {
        page: 1,
        limit: 10,
      },
      icon: "MdLocalParking", // the component being exported from icons/index.js
      name: "Parkings", // name that appear in Sidebar
    },
    {
      url: "/access-card", // the url
      path: "/access-card", // the pathname
      query: {
        page: 1,
        limit: 10,
      },
      icon: "MdCreditCard", // the component being exported from icons/index.js
      name: "Access Card", // name that appear in Sidebar
    },
    {
      url: "/localshop/bm",
      path: "/localshop/bm",
      icon: "MdStore",
      name: "Local Shop",
      query: {
        page: 1,
        limit: 10,
        status: "All Status"
      },
    },
    {
      url: "/multi-media",
      path: "/multi-media",
      icon: "MdStore",
      name: "Multi Media",
    },
    {
      icon: "",
      name: "Task Management",
      routes: [
        {
          url: "/task-management/complaint",
          path: "/task-management/complaint",
          name: "Complaint",
          icon: "MdWarning",
        },
        {
          url: "/task-management/task-list",
          path: "/task-management/task-list",
          query: {
            page: 1,
            limit: 10,
          },
          name: "Tasks",
          icon: "MdOutlineWork",
        },
      ],
    },
    {
      icon: "",
      name: "Inventories & Assets",
      routes: [
        {
          url: "/inventory-assets/inventory",
          path: "/inventory-assets/inventory",
          name: "Inventories",
          icon: "MdOutlineWork",
        },
        {
          url: "/inventory-assets/assets",
          path: "/inventory-assets/assets",
          name: "Assets",
          icon: "MdOutlineCheckCircleOutline",
          query: {
            page: 1,
            limit: 10,
          },
        },
        {
          url: "/inventory-assets/products",
          path: "/inventory-assets/products",
          query: {
            page: 1,
            limit: 10,
            status: "active",
          },
          name: "Products",
          icon: "MdOutlineShoppingCart",
        },
        {
          url: "/inventory-assets/location",
          path: "/inventory-assets/location",
          name: "Locations",
          icon: "MdOutlineMap",
          menus: [
            // submenu dropdown
            {
              url: "/inventory-assets/location/storage",
              path: "/inventory-assets/location/storage",
              name: "Storage",
              icon: "",
            },
            {
              url: "/inventory-assets/location/others",
              path: "/inventory-assets/location/others",
              name: "Others",
              icon: "",
            },
          ],
        },
        {
          url: "/inventory-assets/stock",
          path: "/inventory-assets/stock",
          name: "Stock",
          icon: "MdTrendingUp",
          menus: [
            // submenu dropdown
            {
              url: "/inventory-assets/stock/request-order",
              path: "/inventory-assets/stock/request-order",
              name: "Request Order",
              icon: "",
              query: {
                page: 1,
                limit: 10,
              },
            },
            {
              url: "/inventory-assets/stock/purchase-order",
              path: "/inventory-assets/stock/purchase-order",
              name: "Purchase Order",
              icon: "",
              query: {
                page: 1,
                limit: 10,
              },
            },
            {
              url: "/inventory-assets/stock/move-usage",
              path: "/inventory-assets/stock/move-usage",
              name: "Move & Usage",
              icon: "",
              query: {
                page: 1,
                limit: 10,
              },
            },
            {
              url: "/inventory-assets/stock/stock-taking",
              path: "/inventory-assets/stock/stock-taking",
              name: "Stock Taking",
              icon: "",
              query: {
                page: 1,
                limit: 10,
              },
            },
            {
              url: "/inventory-assets/stock/asset-out",
              path: "/inventory-assets/stock/asset-out",
              name: "Asset Out",
              icon: "",
              query: {
                page: 1,
                limit: 10,
              },
            },
            {
              url: "/inventory-assets/stock/transactions",
              path: "/inventory-assets/stock/transactions",
              name: "Transactions",
              icon: "",
              query: {
                page: 1,
                limit: 10,
              },
            },
          ],
        },
        {
          url: "/inventory-assets/vendor",
          path: "/inventory-assets/vendor",
          name: "Vendor",
          query: {
            page: 1,
            limit: 10,
          },
          icon: "MdOutlinePeople",
        },
      ],
    },
    {
      icon: "",
      path: "/settings",
      name: "Settings",
      routes: [
        {
          url: "/settings/data-master/general-informations",
          path: "/settings/data-master",
          name: "Properties",
          icon: "MdSettings",
        },
        {
          url: "/settings/users/user-management",
          path: "/settings/users",
          name: "Users",
          icon: "MdPeople",
        },
      ],
    },
  ];