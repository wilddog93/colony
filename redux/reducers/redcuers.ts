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
  towerManagement: towerReducers,
  floorManagement: floorReducers,
  floorTypeManagement: floorTypeReducers,
});
