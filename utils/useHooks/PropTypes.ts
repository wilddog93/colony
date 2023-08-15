// user
export type UserProps = {
  id?: number | any;
  email?: string | any;
  firstName?: string | any;
  lastName?: string | any;
  nickName?: string | any;
  documentNumber?: string | any;
  documentSource?: string | any;
  profileImage?: string | any;
  phoneNumber?: string | any;
  birthday?: string | any;
  gender?: string | any;
  userAddress?: string | any;
};
// user end

// projects
export type ProjectTypeProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  projectTypeName?: string | any;
  projectTypeDescription?: string | any;
  projectTypePriority?: string | any;
};

export type ProjectProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  projectCode?: null;
  projectName?: string | any;
  projectDescription?: string | any;
  scheduleStart?: string | any;
  scheduleEnd?: string | any;
  executionStart?: string | any;
  executionEnd?: string | any;
  projectStatus?: string | any;
  totalTask?: number | any;
  totalTaskCompleted?: number | any;
  projectType?: ProjectTypeProps | any;
  issue?: any | null;
  projectMembers?: any | any[];
};
// end project

// task
export type TaskCategoryProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  taskCategoryName?: string | any;
  taskCategoryDescription?: string | any;
  taskCategoryFillColor?: string | any;
  taskCategoryTextColor?: string | any;
};

export type TaskProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  taskCode?: string | any;
  taskName?: string | any;
  taskDescription?: string | any;
  taskOrder?: number | any;
  scheduleStart?: string | any;
  scheduleEnd?: string | any;
  executionStart?: string | any;
  executionEnd?: string | any;
  taskStatus?: string | any;
  totalSubTask?: number | any;
  totalAttachment?: number | any;
  totalComment?: number | any;
  project?: ProjectProps | any;
  taskCategories: TaskCategoryProps[] | any[];
  taskAssignees: UserProps[] | any[];
};
// end task

// subtask
export type SubTaskProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  subTaskName?: string | any;
  subTaskDescription?: string | any;
  subTaskStatus?: boolean;
  subTaskAssignees?: UserProps[] | any[];
};
// subtask end

// options
export interface OptionProps {
  value: string | any;
  label: string | any;
}

// issues
export interface IssueCategoryProps {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  issueCategoryCode: string | any;
  issueCategoryName: string | any;
  issueCategoryDescription: string | any;
}

export interface IssueTypeProps {
  id: 1;
  createdAt?: string | any;
  updatedAt?: string | any;
  issueTypeCode: string | any;
  issueTypeName: string | any;
  issueTypeDescription: string | any;
}

export interface OccupantProps {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  startTime?: string | any;
  endTime?: string | any;
  isMobileDefault?: boolean;
  user?: UserProps;
}

export interface IssueProps {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  issueCode?: string | any;
  issueName?: string | any;
  issueDescription?: string | any;
  complaintSource?: string | any;
  complainantName?: string | any;
  phoneNumber?: string | any;
  issueResponse?: string | any;
  issueStatus?: string | any;
  issueCategory?: IssueCategoryProps;
  issueType?: IssueTypeProps;
  occupant?: OccupantProps;
  project?: ProjectProps | any;
  issueCreator?: UserProps;
}

// bm
// unit
export type UnitProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  unitName?: string | any;
  unitDescription?: null;
  unitImage?: string | any;
  unitSize?: string | any;
  unitOrder?: number | any;
  totalOngoingBill?: number | string | any;
  totalUnreadMessageLocalshop?: number | any;
  totalAmenity?: number | any;
};

// parking
export type ParkingProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  lotCode?: string | any;
  lotType?: string | any;
  parkingStatus?: string | any | "Occupied";
  vehicleNumber?: string | any;
  unitOwned?: UnitProps | any;
  unitLent?: any;
};

// vehicle-registered
export type ParkingVehicleProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  vehicleNumber?: string | any;
  ownerName?: string | any;
  passNumber?: string | any;
  start?: string | any;
  end?: string | any;
  totalEntry?: string | number | any;
  entryBy?: string | any;
  entryTime?: string | any;
  unit?: UnitProps;
};

// vehicle-transaction
export type ParkingTransactionProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  vehicleNumber?: string | any;
  inTime?: string | any;
  inPost?: string | any;
  inCashier?: string | any;
  outTime?: string | any;
  outPost?: string | any;
  outCashier?: string | any;
  type?: string | any;
  duration?: string | any;
  income?: string | any;
  passNumber?: string | any;
};

// access-card
export type AccessCardProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  cardNumber?: string | any;
  cardHolder?: string | any;
  activeDate?: string | any;
  expiryDate?: string | any;
  cardType?: string | any;
  unit?: UnitProps;
};

// access-card transaction
export type AccessCardTransactionProps = {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  activeDate?: string | any;
  accessed?: string | any;
  officer?: string | any;
  accessCard?: AccessCardProps;
};
// end BM

// asset-management
// product
export type LocationProps = {
  id?: number | string | any;
  qty?: number | string | any;
  assets?: any[];
};
export type ProductProps = {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  productName?: string | any;
  productDescription?: string | any;
  productImage?: string | any;
  productType?: string | any;
  productMinimumStock?: number | string | any;
  productQty?: number | string | any;
  productOrderQty?: number | string | any;
  qty?: number | string | any;
  price?: number | string | any;
  location?: LocationProps[] | any[];
};

export type RequestProductProps = {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  requestQty?: number | string | any;
  requestQtyCompleted?: number | string | any;
  product?: ProductProps;
  location?: any;
};

export type RequestAssetProps = {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  requestQty?: number | string | any;
  requestQtyCompleted?: number | string | any;
  asset?: ProductProps;
  location?: any;
};

export type RequestOrderProps = {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  requestNumber?: string | any;
  requestDescription?: string | any;
  requestType?: string | any;
  requestStatus?: string | any;
  documents?: any | any[];
  requestProducts?: RequestProductProps[];
  requestAssets?: RequestAssetProps[];
};

export type VendorProps = {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  vendorName?: string | any;
  vendorDescription?: string | any;
  vendorLogo?: string | any;
  vendorWebsite?: string | any;
  vendorPhone?: number | string | any;
  vendorEmail?: string | any;
  vendorLegalName?: string | any;
  vendorLegalAddress?: string | any;
};

export type OrderProducts = {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  orderQty?: number | string | any;
  orderPrice?: number | string | any;
  orderQtyCompleted?: number | string | any;
  product?: ProductProps;
  orderProductRequests?: any[];
};

// purchase-order
export type PurchaseOrderProps = {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  orderNumber?: string | any;
  orderDescription?: string | any;
  orderStatus?: string | any;
  totalPrice?: number | string | any;
  documents?: any | any[];
  vendor?: VendorProps;
  rrderProducts?: OrderProducts[];
};

// transaction
export type TransactionProps = {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  documents?: any | any[];
  totalPrice?: number | string | any;
  transactionDescription?: string | any;
  transactionNumber?: string | any;
  transactionStatus?: string | any;
  transactionType?: string | any;
};
