import React, { Component } from "react";
import {
  Text,
  Alert,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView
} from "react-native";
import { Button } from "react-native-elements";
import RootNavigator from "../navigations/RootNavigator";
import axios from "axios";
import { connect } from "react-redux";
import address from "../config/address";
import { Permissions, Notifications } from "expo";
import { login, getImages } from "../redux/Actions";
import { Spinner, Input } from "./components";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      token: "",
      expoDeviceToken: {}
    };
    this.set = this.set.bind(this);
  }

  componentWillMount() {}

  async getDeviceToken() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    let deviceToken = await Notifications.getExpoPushTokenAsync();

    const pushBody = {
      device_type: "expo",
      device_token: deviceToken
    };
    this.setState({ expoDeviceToken: pushBody });
  }

  login = async () => {
    this.getDeviceToken();
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      "289150898353901",
      {
        permissions: ["public_profile", "email", "user_birthday", "user_gender"]
      }
    );

    if (type === "success") {
      const body = {
        access_token: token
      };
      axios
        .post(address + "/api/users/login/facebook", body)
        .then(rjson => {
          if (rjson.data.success === false) {
            this.onLoginFail();
          } else {
            headerObj = {
              Authorization: "Bearer " + rjson.data.token
            };
            console.log(this.state.expoDeviceToken);
            this.props.dispatch(
              login(rjson.data, headerObj, this.state.expoDeviceToken)
            );
            this.onLoginSuccess();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  onButtonPress() {
    const { email, password } = this.state;
    this.setState({ loading: true });

    const user = {
      email: this.state.email,
      password: this.state.password
    };
    axios
      .post(address + "/api/users/login", user)
      .then(rjson => {
        if (rjson.data.success === false) {
          this.onLoginFail();
        } else {
          headerObj = {
            Authorization: "Bearer " + rjson.data.token
          };
          this.props.dispatch(
            login(rjson.data, headerObj, this.state.expoDeviceToken)
          );
          this.onLoginSuccess();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  onLoginFail() {
    this.setState({ loading: false });
    Alert.alert(
      "Authentication failed",
      "Email and/or password is incorrect.",
      [{ text: "OK" }],
      { cancelable: false }
    );
  }

  onLoginSuccess() {
    this.setState({
      email: "",
      password: "",
      loading: false
    });
    this.props.navigation.navigate("Secondary");
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }
    return (
      <View style={{ alignItems: "center" }}>
        <Button
          style={{ margin: 20 }}
          title="Login"
          buttonStyle={{
            width: 250,
            borderRadius: 40,
            backgroundColor: "#38EEB4"
          }}
          onPress={this.onButtonPress.bind(this)}
        />
      </View>
    );
  }

  forgotPassword() {
    const { email } = this.state;
    const body = {
      email: email
    };
    axios.post(address + "/api/users/forgot", body).then(res => {
      if (email == "") {
        Alert.alert(
          "Oops!!",
          "Please enter a valid email in the email field above",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Reset Password Email Sent",
          "Please check your inbox for " + email + ".",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    });
  }

  set(key, val) {
    this.setState({
      [key]: val
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    if (this.props.loggedIn) {
      if (this.state.loading) {
        return <Spinner size="small" />;
      }
      return null;
    } else {
      return (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            paddingHorizontal: 20
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              style={{ height: 110, width: 110, marginBottom: 20 }}
              source={require("../assets/fitx-logo.png")}
            />
          </View>
          <KeyboardAvoidingView behavior="padding" enabled>
            <Input
              placeHolder="Email"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={email => this.set("email", email)}
            />

            <Input
              secureTextEntry
              placeHolder="Password"
              keyboardType="default"
              value={this.state.password}
              onChangeText={password => this.set("password", password)}
            />
          </KeyboardAvoidingView>

          {this.renderButton()}
          <View style={{ alignItems: "center" }}>
            <Button
              icon={{ name: "logo-facebook", type: "ionicon" }}
              style={{ margin: 5 }}
              title="Login with Facebook"
              buttonStyle={{
                width: 250,
                borderRadius: 40,
                backgroundColor: "#405D9A"
              }}
              onPress={this.login.bind(this)}
            />
          </View>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <TouchableOpacity onPress={this.forgotPassword.bind(this)}>
              <Text style={{ color: "#505050" }}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ fontWeight: "700" }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigate("Signup")}>
              <Text style={{ marginTop: 10, color: "#505050" }}>
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: "center",
    color: "red"
  }
};

function mapStateToProps(state) {
  return {
    user: state.user,
    loggedIn: state.loggedIn,
    token: state.token
  };
}

export default connect(mapStateToProps)(LoginForm);
