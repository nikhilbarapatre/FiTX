import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import AddDetails from "../screens/AddDetails";
import Questions from "../screens/Questions";

export default createStackNavigator(
  {
    Details: {
      screen: AddDetails,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Questions: {
      screen: Questions,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
