import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import LoginForm from "../screens/LoginForm";
import SignUp from "../screens/SignUp";

export default createStackNavigator(
  {
    Login: {
      screen: LoginForm,
      navigationOptions: {
        header: null
      }
    },
    Signup: {
      screen: SignUp,
      navigationOptions: {
        headerTitle: "Sign Up",
        headerStyle: {
          borderBottomWidth: 0
        }
      }
    }
  },
  {
    initialRouteName: "Login"
  }
);
