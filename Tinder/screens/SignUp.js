import React, { Component } from "react";
import { Text, View, ScrollView, KeyboardAvoidingView } from "react-native";
import RootNavigator from "../navigations/RootNavigator";
import axios from "axios";
import { connect } from "react-redux";
import address from "../config/address";
import { Button } from "react-native-elements";
import { login, getImages } from "../redux/Actions";
import { Permissions, Notifications } from "expo";
import { Input, Spinner } from "./components";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      loading: false
    };
    this.set = this.set.bind(this);
  }

  componentWillMount() {}

  async onButtonPress() {
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

    const { email, password } = this.state;
    this.setState({ error: "", loading: true });

    const user = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    };
    axios
      .post(address + "/api/users", user)
      .then(res => {
        this.onSignUpSuccess(res.data, pushBody);
      })
      .catch(err => console.log(err));
  }

  onSignupFail() {
    this.setState({ error: "Sorry, authentication failed", loading: false });
  }

  onSignUpSuccess(user, pushBody) {
    const body = {
      email: this.state.email,
      password: this.state.password
    };
    axios.post(address + "/api/users/login", body).then(rjson => {
      if (rjson.data.success === false) {
        this.onSignupFail();
      } else {
        headerObj = {
          Authorization: "Bearer " + rjson.data.token
        };
      }
      this.props.dispatch(login(user, headerObj, pushBody));
      this.setState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        loading: false,
        error: ""
      });
      this.props.navigation.navigate("Secondary");
    });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Button
          style={{ margin: 20 }}
          title="Get Swipin'"
          buttonStyle={{
            width: 250,
            borderRadius: 40,
            backgroundColor: "#45CDA2"
          }}
          onPress={this.onButtonPress.bind(this)}
        />
      </View>
    );
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
            paddingHorizontal: 20
          }}
        >
          <KeyboardAvoidingView behavior="padding" enabled>
            <Input
              placeHolder="First name"
              keyboardType="default"
              value={this.state.firstName}
              onChangeText={firstName => this.set("firstName", firstName)}
            />

            <Input
              placeHolder="Last name"
              keyboardType="default"
              value={this.state.lastName}
              onChangeText={lastName => this.set("lastName", lastName)}
            />

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
          {/* <Text style={styles.errorTextStyle}>{this.state.error}</Text> */}
          {this.renderButton()}
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
    token: state.token
  };
}
export default connect(mapStateToProps)(SignUp);
