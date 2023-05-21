export type MenuProps = {
  title?: string;
  pages?: string;
  subMenus?: MenuProps[];
  className?: string;
  pathname?: string;
  url?: string;
  query?: any;
  icon?: string;
  classIcon?: string;
  routes?: MenuProps[];
};

// master routes
export const menuMaster: MenuProps[] = [
  {
    subMenus: [
      {
        pathname: "Building Management",
        pages: "building-management",
        url: "/building-management",
        icon: "MdMuseum",
        classIcon: "w-8 h-8 text-meta-5",
        className: "text-lg"
        // text-[#44C2FD]
      },
      {
        pathname: "Billings & Payments",
        pages: "billings-payments",
        url: "/billings-payments",
        icon: "MdMonetizationOn",
        classIcon: "w-8 h-8 text-meta-3",
        className: "text-lg"
        // text-[#44FDAF]
      },
      {
        pathname: "Task Management",
        pages: "tasks",
        url: "/tasks",
        icon: "MdWork",
        classIcon: "w-8 h-8 text-meta-7",
        className: "text-lg"
        // text-[#F7597F] 
      },
      {
        pathname: "Assets & Inventories",
        pages: "assets-inventories",
        url: "/assets-inventories",
        icon: "MdUnarchive",
        classIcon: "w-8 h-8 text-meta-6",
        className: "text-lg"
        // text-[#F7E759]
      },
      {
        pathname: "Media",
        pages: "media",
        url: "/media/videos",
        icon: "MdPhotoSizeSelectActual",
        classIcon: "w-8 h-8 text-primary",
        className: "text-lg"
      },
      {
        pathname: "Merchants",
        pages: "merchants",
        url: "/merchants",
        icon: "MdStore",
        classIcon: "w-8 h-8 text-meta-8",
        className: "text-lg"
        // text-[#F79259]
      },
    ]
  },
  {
    subMenus: [
      {
        pathname: "Settings",
        pages: "settings",
        url: "/settings",
        icon: "MdOutlineSettings",
        classIcon: "w-8 h-8",
      },
      {
        pathname: "Helps",
        pages: "helps",
        url: "/helps",
        icon: "MdHelpOutline",
        classIcon: "w-8 h-8",
      },
    ]
  }
];

// Building Management
export const menuBM: MenuProps[] = [
  {
    pathname: "Dashboard",
    pages: "dashboard",
    url: "/building-management",
    icon: "MdOutlineDashboard"
  },
  {
    pathname: "Occupancy",
    pages: "occupancy",
    url: "/building-management/occupancy",
    query: {
      page: 1,
      limit: 10,
    },
    icon: "MdOutlinePeopleAlt"
  },
  {
    pathname: "Tower Management",
    pages: "towers",
    url: "/building-management/towers",
    query: {
      page: 1,
      limit: 10,
    },
    icon: "MdOutlineBusiness"
  },
  {
    pathname: "Area Grouping",
    url: "/building-management/areas",
    query: {
      page: 1,
      limit: 10,
    },
    icon: "MdOutlineMap"
  },
  {
    subMenus: [
      {
        pathname: "Parkings",
        pages: "parkings",
        url: "",
        icon: "MdLocalParking",
        routes: [
          {
            pathname: "Parking Lot",
            url: "/building-management/parkings/parking-lots",
            query: {
              page: 1,
              limit: 10,
            },
          },
          {
            pathname: "Registered Vehicles",
            url: "/building-management/parkings/vehicles",
            query: {
              page: 1,
              limit: 10,
            },
          },
          {
            pathname: "Vehicle Transaction",
            url: "/building-management/parkings/transactions",
            query: {
              page: 1,
              limit: 10,
            },
          },
        ]
      },
      {
        pathname: "Access Card",
        pages: "access-card",
        url: "",
        icon: "MdCardMembership",
        routes: [
          {
            pathname: "Master Data",
            url: "/building-management/access-card/master-data",
            query: {
              page: 1,
              limit: 10,
            },
          },
          {
            pathname: "History transaction",
            url: "/building-management/access-card/transactions",
            query: {
              page: 1,
              limit: 10,
            },
          },
        ]
      },
    ],
    title: "Additional Features"
  },
];

export const menuParkings: MenuProps[] = [
  {
    pathname: "Parking Lot",
    url: "/building-management/parkings/parking-lots",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Registered Vehicle",
    url: "/building-management/parkings/vehicles",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "Vehicle Transaction",
    url: "/building-management/parkings/transactions",
    query: {
      page: 1,
      limit: 10,
    },
  },
];

export const menuAccessCard: MenuProps[] = [
  {
    pathname: "Master Data",
    url: "/building-management/access-card/master-data",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "History Transaction",
    url: "/building-management/access-card/transactions",
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
    url: "/media/videos",
    query: {
      page: 1,
      limit: 10,
    },
  },
  {
    pathname: "News & Articles",
    pages: "articles",
    url: "/media/articles",
    query: {
      page: 1,
      limit: 10,
    },
  },
];