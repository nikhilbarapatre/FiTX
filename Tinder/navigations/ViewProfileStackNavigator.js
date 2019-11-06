import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import ViewProfile from "../screens/ViewProfile";
import Profile from "../screens/Profile";
import EditProfileNavigator from "./EditProfileNavigator";

export default createStackNavigator(
  {
    Profile: {
      screen: Profile
    },
    ViewProfile: {
      screen: ViewProfile
    },
    Edit: {
      screen: EditProfileNavigator
    }
  },
  {
    initialRouteName: "Profile",
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
