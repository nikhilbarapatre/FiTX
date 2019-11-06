import React, { Component } from "react";
import { Text, View } from "react-native";
import Reducers from "./redux/Reducers";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import styles from "./styles";
import RootNavigator from "./navigations/RootNavigator";
//import AddDetails from "./screens/AddDetails";
const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(Reducers, middleware);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    );
  }
}
