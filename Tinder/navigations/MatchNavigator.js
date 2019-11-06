import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import Matches from "../screens/Matches";
import Chat from "../screens/Chat";

export default createStackNavigator(
  {
    Matches: {
      screen: Matches
    },
    Chat: {
      screen: Chat
    }
  },
  {
    initialRouteName: "Matches",
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
