import * as actionTypes from "./actionTypes";
import { csv } from "d3";

export const loadData = () => {
  return {
    type: actionTypes.INIT_DATA,
  };
};

export const selectPlan = (plan) => {
  return {
    type: actionTypes.SELECT_PLAN,
    currentPlan: plan,
  };
};

export const estimatedMiles = (miles) => {
  return {
    type: actionTypes.MILES_TO_BE_DRIVEN,
    milesToBeDriven: miles,
  };
};
