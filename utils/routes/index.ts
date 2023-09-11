import { IconType } from "react-icons";
import {
  MdArchive,
  MdAssignment,
  MdCardMembership,
  MdCreditCard,
  MdHelpOutline,
  MdLocalParking,
  MdMonetizationOn,
  MdMoneyOff,
  MdMuseum,
  MdOutlineBusiness,
  MdOutlineDashboard,
  MdOutlineFileCopy,
  MdOutlineInfo,
  MdOutlineMap,
  MdOutlineNextWeek,
  MdOutlinePeopleAlt,
  MdOutlineSettings,
  MdPeople,
  MdPermDeviceInformation,
  MdPhotoSizeSelectActual,
  MdReceipt,
  MdShoppingCart,
  MdStorage,
  MdStore,
  MdTrendingUp,
  MdUnarchive,
  MdWarningAmber,
  MdWork,
} from "react-icons/md";

export type MenuProps = {
  title?: string;
  pages?: string;
  subMenus?: MenuProps[];
  className?: string;
  pathname?: string;
  url?: string;
  query?: any;
  icons?: {
    icon: IconType;
    className?: string;
  };
  routes?: MenuProps[];
};

// master routes
export const menuPropertyMaster: MenuProps[] = [
  {
    subMenus: [
      {
        pathname: "Building Management",
        pages: "building-management",
        url: "/employee/building-management",
        icons: {
          icon: MdMuseum,
          className: "w-8 h-8 text-meta-5",
        },
        className: "text-lg",
        // text-[#44C2FD]
      },
      {
        pathname: "Billings & Payments",
        pages: "billings",
        url: "/employee/billings",
        icons: {
          icon: MdMonetizationOn,
          className: "w-8 h-8 text-meta-3",
        },
        className: "text-lg",
        // text-[#44FDAF]
      },
      {
        pathname: "Task Management",
        pages: "tasks",
        url: "/employee/tasks",
        icons: {
          icon: MdWork,
          className: "w-8 h-8 text-meta-7",
        },
        className: "text-lg",
        // text-[#F7597F]
      },
      {
        pathname: "Assets & Inventories",
        pages: "assets-management",
        url: "/employee/assets-management/products",
        icons: {
          icon: MdUnarchive,
          className: "w-8 h-8 text-meta-6",
        },
        className: "text-lg",
        // text-[#F7E759]
      },
      {
        pathname: "Media",
        pages: "media",
        url: "/employee/media/videos",
        icons: {
          icon: MdPhotoSizeSelectActual,
          className: "w-8 h-8 text-primary",
        },
        className: "text-lg",
      },
      {
        pathname: "Merchants",
        pages: "merchants",
        url: "/employee/merchants",
        icons: {
          icon: MdStore,
          className: "w-8 h-8 text-meta-8",
        },
        className: "text-lg",
        // text-[#F79259]
      },
    ],
  },
  {
    subMenus: [
      {
        pathname: "Settings",
        pages: "employee/settings",
        url: "/settings",
        icons: {
          icon: MdOutlineSettings,
          className: "w-8 h-8",
        },
      },
      {
        pathname: "Helps",
        pages: "helps",
        url: "/helps",
        icons: {
          icon: MdHelpOutline,
          className: "w-8 h-8",
        },
      },
    ],
  },
];

// Building Management
export const menuBM: MenuProps[] = [
  {
    pathname: "Dashboard",
    pages: "dashboard",
    url: "/employee/building-management",
    icons: {
      icon: MdOutlineDashboard,
      className: "w-5 h-5",
    },
  },
  {
    pathname: "Occupancy",
    pages: "occupancy",
    url: "/employee/building-management/occupancy",
    query: {
      page: 1,
      limit: 5,
    },
    icons: {
      icon: MdOutlinePeopleAlt,
      className: "w-5 h-5",
    },
  },
  {
    pathname: "Tower Management",
    pages: "towers",
    url: "/employee/building-management/towers",
    query: {
      page: 1,
      limit: 5,
    },
    icons: {
      icon: MdOutlineBusiness,
      className: "w-5 h-5",
    },
  },
  {
    pathname: "Area Grouping",
    url: "/employee/building-management/areas",
    query: {
      page: 1,
      limit: 10,
    },
    icons: {
      icon: MdOutlineMap,
      className: "w-5 h-5",
    },
  },
  {
    subMenus: [
      {
        pathname: "Parkings",
        pages: "parkings",
        url: "",
        icons: {
          icon: MdLocalParking,
          className: "w-5 h-5",
        },
        routes: [
          {
            pathname: "Parking Lot",
            url: "/employee/building-management/parkings/parking-lots",
            query: {
              page: 1,
              limit: 10,
            },
          },
          {
            pathname: "Registered Vehicles",
            url: "/employee/building-management/parkings/vehicles",
            query: {
              page: 1,
              limit: 10,
            },
          },
          {
            pathname: "Vehicle Transaction",
            url: "/employee/building-management/parkings/transactions",
            query: {
              page: 1,
              limit: 10,
            },
          },
        ],
      },
      {
        pathname: "Access Card",
        pages: "access-card",
        url: "",
        icons: {
          icon: MdCardMembership,
          className: "w-5 h-5",
        },
        routes: [
          {
            pathname: "Master Data",
            url: "/employee/building-management/access-card/master-data",
            query: {
              page: 1,
              limit: 10,
            },
          },
          {
            pathname: "History transaction",
            url: "/employee/building-management/access-card/transactions",
            query: {
              page: 1,
              limit: 10,
            },
          },
        ],
      },
    ],
    title: "Additional Features",
  },
];

export const menuMerchant: MenuProps[] = [
  {
    pathname: "Item List",
    url: "/merchant/detail",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Category List",
    url: "/merchant/category",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Discounts",
    url: "/merchant/discounts",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Open Hours",
    url: "/merchant/hours",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

export const menuParkings: MenuProps[] = [
  {
    pathname: "Parking Lot",
    url: "/employee/building-management/parkings/parking-lots",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Registered Vehicle",
    url: "/employee/building-management/parkings/vehicles",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Vehicle Transaction",
    url: "/employee/building-management/parkings/transactions",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

export const menuAccessCard: MenuProps[] = [
  {
    pathname: "Master Data",
    url: "/employee/building-management/access-card/master-data",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "History Transaction",
    url: "/employee/building-management/access-card/transactions",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

// media
export const menuMedia: MenuProps[] = [
  {
    pathname: "Video Media",
    pages: "videos",
    url: "/employee/media/videos",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "News & Articles",
    pages: "articles",
    url: "/employee/media/articles",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

// task
export const menuTask: MenuProps[] = [
  {
    pathname: "Dashboard",
    pages: "dashboard",
    url: "/employee/tasks",
    icons: {
      icon: MdOutlineDashboard,
      className: "w-5 h-5",
    },
  },
  {
    pathname: "Projects",
    pages: "projects",
    icons: {
      icon: MdOutlinePeopleAlt,
      className: "w-5 h-5",
    },
    routes: [
      {
        pathname: "Table View",
        url: "/employee/tasks/projects/tables",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        pathname: "Schedule Board",
        url: "/employee/tasks/projects/calendar-board",
        query: {
          page: 1,
          limit: 10,
        },
      },
    ],
  },
  {
    pathname: "Issues",
    pages: "issues",
    url: "/employee/tasks/issues",
    query: {
      page: 1,
      limit: 10,
    },
    icons: {
      icon: MdOutlineBusiness,
      className: "w-5 h-5",
    },
  },
  {
    subMenus: [
      {
        pathname: "Project Type",
        url: "/employee/tasks/settings/project-type",
        query: {
          page: 1,
          limit: 10,
        },
        icons: {
          icon: MdOutlineNextWeek,
          className: "w-5 h-5",
        },
      },
      {
        pathname: "Team Members",
        url: "/employee/tasks/settings/team-members",
        query: {
          page: 1,
          limit: 10,
        },
        icons: {
          icon: MdOutlinePeopleAlt,
          className: "w-5 h-5",
        },
      },
      {
        pathname: "Task Category",
        url: "/employee/tasks/settings/task-category",
        query: {
          page: 1,
          limit: 10,
        },
        icons: {
          icon: MdAssignment,
          className: "w-5 h-5",
        },
      },
      {
        pathname: "Issue Category",
        url: "/employee/tasks/settings/issue-category",
        query: {
          page: 1,
          limit: 10,
        },
        icons: {
          icon: MdWarningAmber,
          className: "w-5 h-5",
        },
      },
      {
        pathname: "Issue Type",
        url: "/employee/tasks/settings/issue-type",
        query: {
          page: 1,
          limit: 10,
        },
        icons: {
          icon: MdOutlineInfo,
          className: "w-5 h-5",
        },
      },
    ],
    title: "Settings",
  },
];

export const menuProjects: MenuProps[] = [
  {
    pathname: "Table View",
    url: "/employee/tasks/projects/tables",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Schedule Board",
    url: "/employee/tasks/projects/calendar-board",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

// assets & inventories
export const menuAssets: MenuProps[] = [
  {
    pathname: "Products",
    pages: "products",
    url: "/employee/assets-management/products",
    icons: {
      icon: MdShoppingCart,
      className: "w-5 h-5",
    },
  },
  {
    pathname: "Assets & Inventories",
    pages: "assets-inventories",
    icons: {
      icon: MdUnarchive,
      className: "w-5 h-5",
    },
    routes: [
      {
        pathname: "Assets",
        url: "/employee/assets-management/assets-inventories/assets",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        pathname: "Inventories",
        url: "/employee/assets-management/assets-inventories/inventories",
        query: {
          page: 1,
          limit: 10,
        },
      },
    ],
  },
  {
    pathname: "Locations",
    pages: "locations",
    icons: {
      icon: MdStorage,
      className: "w-5 h-5",
    },
    routes: [
      {
        pathname: "Storage",
        url: "/employee/assets-management/locations/storages",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        pathname: "Other",
        url: "/employee/assets-management/locations/others",
        query: {
          page: 1,
          limit: 10,
        },
      },
    ],
  },
  {
    pathname: "Stocks",
    pages: "stocks",
    icons: {
      icon: MdTrendingUp,
      className: "w-5 h-5",
    },
    routes: [
      {
        pathname: "Request Order",
        url: "/employee/assets-management/stocks/request-order",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        pathname: "Purchase Order",
        url: "/employee/assets-management/stocks/purchase-order",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        pathname: "Move & Usage",
        url: "/employee/assets-management/stocks/move-usage",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        pathname: "Asset Out",
        url: "/employee/assets-management/stocks/asset-out",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        pathname: "Stock Taking",
        url: "/employee/assets-management/stocks/stock-taking",
        query: {
          page: 1,
          limit: 10,
        },
      },
      {
        pathname: "Transactions",
        url: "/employee/assets-management/stocks/transactions",
        query: {
          page: 1,
          limit: 10,
        },
      },
    ],
  },
  {
    pathname: "Vendor",
    pages: "vendor",
    url: "/employee/assets-management/vendor",
    icons: {
      icon: MdPeople,
      className: "w-5 h-5",
    },
  },
];

export const menuTabAssets: MenuProps[] = [
  {
    pathname: "Asset",
    url: "/employee/assets-management/assets-inventories/assets",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Inventory",
    url: "/employee/assets-management/assets-inventories/inventories",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

export const menuTabLocations: MenuProps[] = [
  {
    pathname: "Storage",
    url: "/employee/assets-management/locations/storages",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Other",
    url: "/employee/assets-management/locations/others",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

// billing payment
export const menuPayments: MenuProps[] = [
  {
    pathname: "Dashboard",
    pages: "dashboard",
    url: "/employee/billings",
    icons: {
      icon: MdOutlineDashboard,
      className: "w-5 h-5",
    },
  },
  {
    pathname: "Payments",
    pages: "payments",
    url: "/employee/billings/payments",
    query: {
      page: 1,
      limit: 10,
    },
    icons: {
      icon: MdCreditCard,
      className: "w-5 h-5",
    },
  },
  {
    pathname: "Invoices",
    pages: "invoices",
    url: "/employee/billings/invoices",
    query: {
      page: 1,
      limit: 10,
    },
    icons: {
      icon: MdReceipt,
      className: "w-5 h-5",
    },
  },
  {
    pathname: "Receipt",
    pages: "receipt",
    url: "/employee/billings/receipt",
    query: {
      page: 1,
      limit: 10,
    },
    icons: {
      icon: MdArchive,
      className: "w-5 h-5",
    },
  },
  // {
  //   pathname: "Payments",
  //   pages: "payments",
  //   icons: {
  //     icon: MdOutlinePeopleAlt,
  //     className: "w-5 h-5"
  //   },
  //   routes: [
  //     {
  //       pathname: "Table View",
  //       url: "/employee/tasks/projects/tables",
  //       query: {
  //         page: 1,
  //         limit: 10,
  //       },
  //     },
  //     {
  //       pathname: "Schedule Board",
  //       url: "/employee/tasks/projects/calendar-board",
  //       query: {
  //         page: 1,
  //         limit: 10,
  //       },
  //     },
  //   ]
  // },
  {
    subMenus: [
      {
        pathname: "Templates",
        url: "/employee/billings/settings/templates",
        pages: "templates",
        query: {
          page: 1,
          limit: 10,
        },
        icons: {
          icon: MdOutlineFileCopy,
          className: "w-5 h-5",
        },
      },
      {
        pathname: "Taxes",
        url: "/employee/billings/settings/taxes",
        pages: "taxes",
        query: {
          page: 1,
          limit: 10,
        },
        icons: {
          icon: MdMoneyOff,
          className: "w-5 h-5",
        },
      },
      {
        pathname: "Discounts",
        url: "/employee/billings/settings/discounts",
        pages: "discounts",
        query: {
          page: 1,
          limit: 10,
        },
        icons: {
          icon: MdPermDeviceInformation,
          className: "w-5 h-5",
        },
      },
    ],
    title: "Settings",
  },
];

// Menu Master owner
export const menuOwnerMaster: MenuProps[] = [
  {
    pathname: "Home",
    pages: "home",
    url: "/owner/home",
  },
  {
    pathname: "Properties",
    pages: "properties",
    url: "/owner/properties",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Users",
    pages: "users",
    url: "/owner/users",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

export const menuManageDomainOwner: MenuProps[] = [
  {
    pathname: "General Information",
    pages: "home",
    url: "/owner/home/general-information",
  },
  {
    pathname: "Users",
    pages: "home",
    url: "/owner/home/user-list",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Roles",
    pages: "home",
    url: "/owner/home/roles",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Access Group",
    pages: "home",
    url: "/owner/home/access-group",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

// tenant-owner
export const menuTabTenants: MenuProps[] = [
  {
    pathname: "Billing History",
    url: "/tenant/billing",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Transaction History",
    url: "/tenant/transactions",
    query: {
      page: 1,
      limit: 10,
    },
  },
];
