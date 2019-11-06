import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import TabNavigator from "./TabNavigator";
import LoginNavigator from "./LoginNavigator";
import ViewProfile from "../screens/ViewProfile";
import ViewProfileStackNavigator from "./ViewProfileStackNavigator";

const RootStackNavigator = createStackNavigator(
  {
    Main: {
      screen: LoginNavigator
    },
    Secondary: {
      screen: TabNavigator,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: "Main",
    mode: "modal",
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

class RootNavigator extends Component {
  render() {
    return <RootStackNavigator />;
  }
}

export default RootNavigator;
