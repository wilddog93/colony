import { combineReducers } from "@reduxjs/toolkit";
import counterSlice from "../features/counter/counterSlice";
import kanyeReducer from "../features/kanye/kanyeReducer";
import authReducers from "../features/auth/authReducers";
import propertyReducers from "../features/propertyAccess/propertyAccessReducers";
import accessDomainReducers from "../features/accessDomain/accessDomainReducers";
import domainPropertyReducers from "../features/domain/domainProperty";
import domainUserReducers from "../features/domain/domainUser";
import domainAccessGroupReducers from "../features/domain/user-management/domainAccessGroupReducers";
import domainAccessReducers from "../features/domain/user-management/domainAccessReducers ";
import domainStructureReducers from "../features/domain/domainStructure";
import propertyTypeReducers from "../features/property-type/propertyType";
import towerReducers from "../features/building-management/tower/towerReducers";
import floorReducers from "../features/building-management/floor/floorReducers";
import floorTypeReducers from "../features/building-management/floorType/floorReducers";
import amenityReducers from "../features/building-management/amenity/amenityReducers";
import unitTypeReducers from "../features/building-management/unitType/unitTypeReducers";
import unitReducers from "../features/building-management/unit/unitReducers";
import userPropertyReducers from "../features/building-management/users/propertyUserReducers";
import projectTypeReducers from "../features/task-management/settings/projectTypeReducers";
import issueTypeReducers from "../features/task-management/settings/issueTypeReducers";
import issueCategoryReducers from "../features/task-management/settings/issueCategoryReducers";
import taskCategoryReducers from "../features/task-management/settings/taskCategoryReducers";
import projectManagementReducers from "../features/task-management/project/projectManagementReducers";
import taskManagementReducers from "../features/task-management/project/task/taskManagementReducers";
import taskCommentReducers from "../features/task-management/project/taskComment/taskCommentReducers";
import taskTodoReducers from "../features/task-management/project/taskTodo/taskTodoReducers";
import issueManagementReducers from "../features/task-management/issue/issueManagementReducers";
import productManagementReducers from "../features/assets/products/productManagementReducers";
import productCategoryReducers from "../features/assets/products/category/productCategoryReducers";
import productUnitReducers from "../features/assets/products/unit-measurement/productUnitReducers";
import productBrandReducers from "../features/assets/products/brand/productBrandReducers";
import locationManagementReducers from "../features/assets/locations/locationManagementReducers";
import vendorManagementReducers from "../features/assets/vendor/vendorManagementReducers";
import parkingLotReducers from "../features/building-management/parking/parkingLotReducers";
import parkingVehicleReducers from "../features/building-management/parking/parkingVehicleReducers";
import parkingTransactionReducers from "../features/building-management/parking/parkingTransactionReducers";
import accessCardReducers from "../features/building-management/access/accessCardReducers";
import accessCardTransactionReducers from "../features/building-management/access/accessCardTransactionReducers";
import requestManagementReducers from "../features/assets/stocks/requestReducers";
import orderManagementReducers from "../features/assets/stocks/orderReducers";
import transactionManagementReducers from "../features/assets/stocks/transactionReducers";
import stockBalanceManagementReducers from "../features/assets/stocks/stockBalanceReducers";
import productLocationManagementReducers from "../features/assets/locations/productLocationManagementReducers";
import billingTemplateManagementReducers from "../features/billing/template/billingTemplateReducers";
import billingTaxManagementReducers from "../features/billing/tax/billingTaxReducers";
import billingDiscountManagementReducers from "../features/billing/discount/billingDiscountReducers";
import billingManagementReducers from "../features/billing/billingReducers";

export const combinedReducer = combineReducers({
  //All reducer
  counter: counterSlice,
  kanyeQuote: kanyeReducer,
  authentication: authReducers,
  propertyType: propertyTypeReducers,
  propertyAccess: propertyReducers,
  accessDomain: accessDomainReducers,
  domainProperty: domainPropertyReducers,
  domainUser: domainUserReducers,
  domainAccessGroup: domainAccessGroupReducers,
  domainAccess: domainAccessReducers,
  domainStructures: domainStructureReducers,
  // bm
  towerManagement: towerReducers,
  floorManagement: floorReducers,
  floorTypeManagement: floorTypeReducers,
  amenityManagement: amenityReducers,
  unitTypeManagement: unitTypeReducers,
  unitManagement: unitReducers,
  userPropertyManagement: userPropertyReducers,
  parkingLotManagement: parkingLotReducers,
  parkingVehicleManagement: parkingVehicleReducers,
  parkingTransactionManagement: parkingTransactionReducers,
  accessCardManagement: accessCardReducers,
  accessCardTransactionManagement: accessCardTransactionReducers,
  // task-management
  projectType: projectTypeReducers,
  issueType: issueTypeReducers,
  issueCategory: issueCategoryReducers,
  taskCategory: taskCategoryReducers,
  projectManagement: projectManagementReducers,
  taskManagement: taskManagementReducers,
  taskComment: taskCommentReducers,
  taskTodos: taskTodoReducers,
  issueManagement: issueManagementReducers,
  // asset-management
  productManagement: productManagementReducers,
  productCategoryManagement: productCategoryReducers,
  productUnitManagement: productUnitReducers,
  productBrandManagement: productBrandReducers,
  locationManagement: locationManagementReducers,
  productLocationManagement: productLocationManagementReducers,
  vendorManagement: vendorManagementReducers,
  requestManagement: requestManagementReducers,
  orderManagement: orderManagementReducers,
  transactionManagement: transactionManagementReducers,
  stockBalanceManagement: stockBalanceManagementReducers,
  // billing-management
  billingTemplateManagement: billingTemplateManagementReducers,
  billingTaxManagement: billingTaxManagementReducers,
  billingDiscountManagement: billingDiscountManagementReducers,
  billingManagement: billingManagementReducers,
});
