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
  amenityManagement: amenityReducers,
  unitTypeManagement: unitTypeReducers,
  unitManagement: unitReducers,
  userPropertyManagement: userPropertyReducers,
  projectType: projectTypeReducers,
  issueType: issueTypeReducers,
  issueCategory: issueCategoryReducers,
  taskCategory: taskCategoryReducers,
  projectManagement: projectManagementReducers,
  taskManagement: taskManagementReducers,
  taskComment: taskCommentReducers,
  taskTodos: taskTodoReducers,
});
