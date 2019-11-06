import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from "react-native";
import { Header } from "react-native-elements";
import { Font } from "expo";
import RootNavigator from "../navigations/RootNavigator";
import { connect } from "react-redux";
import { PushNotification } from "./components";
import address from "../config/address";
import styles from "../styles";

class Matches extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      matches: [],
      notification: {}
    };

    this.fetchMatches = this.fetchMatches.bind(this);
    this.notificationHandler = this.notificationHandler.bind(this);

    this.notificationActive = true;
    this.screenName = "match";
    this.shouldRenderNotification = this.shouldRenderNotification.bind(this);
    this.disableNotificationAndNavigate = this.disableNotificationAndNavigate.bind(
      this
    );
  }

  componentWillMount() {
    this.fetchMatches();
  }
  async componentDidMount() {
    await Font.loadAsync({
      "product-sans": require("../assets/product-sans/Product-Sans-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  notificationHandler = notification => {
    this.fetchMatches();
  };

  shouldRenderNotification() {
    let navigationCheck;

    navigationCheck = this.props.navigation.state.params;

    if (navigationCheck && navigationCheck.back) {
      if (navigationCheck.back == this.screenName) {
        this.notificationActive = true;
        navigationCheck.back = "";
      }
    }

    return this.notificationActive;
  }

  disableNotificationAndNavigate(screen, extra) {
    this.notificationActive = false;

    let navigationCheck;

    navigationCheck = this.props.navigation.state.params;

    if (navigationCheck && navigationCheck.back) {
      if (navigationCheck.back == this.screenName) {
        navigationCheck.back = "";
      }
    }

    const { navigate } = this.props.navigation;
    navigate(screen, extra);
  }

  fetchMatches = () => {
    fetch(address + "/api/matches/" + this.props.user.id, {
      method: "GET",
      headers: this.props.token
    })
      .then(res => res.json())
      .then(res => {
        if (res.success === true) {
          this.setState({ matches: res.matches.reverse() });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  renderMatches() {
    if (this.state.matches.length === 0) {
      return (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            style={{ height: 150, width: 150 }}
            source={require("../assets/gymnastics.png")}
          />
          <View
            style={{
              marginTop: 50,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {this.state.fontLoaded ? (
              <Text
                style={{
                  fontFamily: "product-sans",
                  fontSize: 34,
                  fontWeight: "700",
                  color: "#434343"
                }}
              >
                No matches found
              </Text>
            ) : (
              <Text
                style={{ fontSize: 34, fontWeight: "700", color: "#434343" }}
              >
                No matches found
              </Text>
            )}
            <Text style={{ marginTop: 10, color: "#9C979B" }}>
              When you match with other users they'll appear here
            </Text>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View>
          {this.state.matches.map(match => {
            let placeholder;

            placeholder = "";

            if (match.chats.length > 0) {
              placeholder = match.chats[0].text;
            }

            return (
              <TouchableOpacity
                style={styles.imgRow}
                key={match.id}
                onPress={() =>
                  this.disableNotificationAndNavigate("Chat", match)
                }
              >
                <Image
                  style={styles.chatImg}
                  source={{ uri: match.images[0] }}
                />
                <View>
                  <Text style={styles.bold}>{match.name}</Text>
                  <Text
                    style={{ color: "#9C979B", fontSize: 18, paddingLeft: 25 }}
                  >
                    {placeholder}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          );
        </View>
      );
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff"
        }}
      >
        <Header
          backgroundColor="#fff"
          leftComponent={
            <TouchableOpacity
              onPress={() =>
                this.disableNotificationAndNavigate("Home", { back: "home" })
              }
            >
              <Image
                style={{ height: 40, width: 65 }}
                source={require("../assets/homeInactive.png")}
              />
            </TouchableOpacity>
          }
          centerComponent={
            <Image
              style={{ height: 40, width: 48 }}
              source={require("../assets/chatActive.png")}
            />
          }
        />
        <PushNotification
          screen="match"
          parentHandle={true}
          parentHandler={this.notificationHandler}
          showPopUp={true}
          renderNotification={this.shouldRenderNotification}
        />
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          {this.renderMatches()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    token: state.token
  };
}

export default connect(mapStateToProps)(Matches);
