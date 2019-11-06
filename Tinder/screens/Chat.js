import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import RootNavigator from "../navigations/RootNavigator";
import { Header, Icon } from "react-native-elements";
import { PushNotification } from "./components";
import axios from "axios";
import { connect } from "react-redux";
import address from "../config/address";
import styles from "../styles";

class Chat extends Component {
  constructor(props) {
    super(props);
    const profile =
      props.navigation.state.params && props.navigation.state.params.profile;
    const images =
      props.navigation.state.params && props.navigation.state.params.images;

    let requestUrl;
    requestUrl =
      address + "/api/" + this.props.user.id + "/chat/" + profile.userId;

    this.state = {
      userProfile: profile,
      userImages: images,
      messages: [],
      requestUrl: requestUrl
    };
    this.fetchChats = this.fetchChats.bind(this);
    this.notificationHandler = this.notificationHandler.bind(this);

    this.notificationActive = true;
    this.screenName = "chat";
    this.shouldRenderNotification = this.shouldRenderNotification.bind(this);
    this.disableNotificationAndNavigate = this.disableNotificationAndNavigate.bind(
      this
    );
  }

  componentWillMount() {
    this.fetchChats();
  }

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

  fetchChats() {
    axios
      .get(this.state.requestUrl, { headers: this.props.token })
      .then(res => {
        this.setState({ messages: res.data.chats.reverse() });
      })
      .catch(err => {
        console.log(err);
      });
  }

  notificationHandler = notification => {
    console.log(notification);

    this.setState(previousState => ({
      messages: GiftedChat.append(
        previousState.messages,
        notification.data.chat
      )
    }));
  };

  onSend(messages = []) {
    let body;

    body = {
      text: messages[messages.length - 1].text
    };

    axios
      .post(this.state.requestUrl, body, { headers: this.props.token })
      .then(res => {
        messages[messages.length - 1]._id = res.data.chat._id;

        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages)
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
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
            <TouchableOpacity>
              <Icon
                size={40}
                name={"chevron-left"}
                onPress={() =>
                  this.disableNotificationAndNavigate("Matches", {
                    back: "match"
                  })
                }
              />
            </TouchableOpacity>
          }
          centerComponent={
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={styles.inLine}
                onPress={() =>
                  this.disableNotificationAndNavigate("ShowUser", {
                    profile: this.state.userProfile,
                    images: this.state.userImages,
                    from: "chat"
                  })
                }
              >
                <Image
                  style={styles.viewImg}
                  source={{ uri: this.state.userImages[0] }}
                />
                <Text style={styles.bold}>
                  {this.state.userProfile.first_name}
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
        <PushNotification
          screen="chat"
          parentHandle={true}
          parentHandler={this.notificationHandler}
          showPopUp={false}
          renderNotification={this.shouldRenderNotification}
        />

        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.props.user.id.toString()
          }}
        />
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

export default connect(mapStateToProps)(Chat);
