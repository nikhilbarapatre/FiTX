import React from "react";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Matches from "../screens/Matches";
import ShowUserProfile from "../screens/ShowUserProfile";
import { createStackNavigator } from "react-navigation";
import ViewProfileStackNavigator from "./ViewProfileStackNavigator";
import MatchNavigator from "./MatchNavigator";

export default createStackNavigator(
  {
    View: {
      screen: ViewProfileStackNavigator
    },
    Home: {
      screen: Home
    },
    Matches: {
      screen: MatchNavigator
    },
    ShowUser: {
      screen: ShowUserProfile
    }
  },
  {
    initialRouteName: "Home",
    animationEnabled: true,
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
