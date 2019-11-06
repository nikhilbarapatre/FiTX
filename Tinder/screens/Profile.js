import React, { Component } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  SafeAreaView
} from "react-native";
import { Header, Button } from "react-native-elements";
import { Font } from "expo";
import { connect } from "react-redux";
import styles from "../styles";
import { logout, uploadImages, getImages } from "../redux/Actions";
import { Ionicons } from "@expo/vector-icons";
import address from "../config/address";
import { PushNotification } from "./components";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imagesLoaded: false,
      fontLoaded: false
    };
    this.display = this.display.bind(this);

    this.notificationActive = true;
    this.screenName = "profile";
    this.shouldRenderNotification = this.shouldRenderNotification.bind(this);
    this.disableNotificationAndNavigate = this.disableNotificationAndNavigate.bind(
      this
    );
    this.logoutButton = this.logoutButton.bind(this);
  }
  componentWillMount = () => {
    let images = this.props.user.images;

    if (images.length == 0) {
      this.fetchImages(images);
    } else {
      this.setState({
        imagesLoaded: true
      });
    }
  };

  async componentDidMount() {
    await Font.loadAsync({
      "product-sans": require("../assets/product-sans/Product-Sans-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  logoutButton() {
    const pushBody = {
      device_type: "expo",
      device_token: this.props.user.deviceToken
    };
    this.props.dispatch(logout(pushBody, this.props.token));

    this.disableNotificationAndNavigate("Login", "", true);
  }

  fetchImages = images => {
    fetch(address + "/api/users/me/pictures", {
      method: "GET",
      headers: this.props.token
    })
      .then(res => res.json())
      .then(res => {
        res.pictures.map(obj => images.push(obj));
        this.props.dispatch(getImages(images));
        this.setState({
          imagesLoaded: true
        });
      })
      .catch(err => console.log(err));
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

  disableNotificationAndNavigate(screen, extra, disableNotification) {
    if (disableNotification) {
      this.notificationActive = false;
    }

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

  display(displayImage) {
    if (displayImage == undefined) {
      return;
    }
    return (
      <Image
        style={styles.displayImg}
        source={{
          uri: displayImage.url
        }}
      />
    );
  }

  addImage = async () => {
    //Make request to the API to upload and store the profile picture.
    this.props.dispatch(uploadImages(this.props.user.images, this.props.token));
  };

  render() {
    let display = this.props.user.firstName + " " + this.props.user.lastName;
    let displayImage;

    displayImage = undefined;

    if (
      this.props.user.images != undefined &&
      this.props.user.images.length > 0
    ) {
      displayImage = this.props.user.images[0];
    }

    const { navigate } = this.props.navigation;
    if (this.props.user.age != null) {
      display += ", " + this.props.user.age;
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Header
          backgroundColor="#fff"
          rightComponent={
            <TouchableOpacity
              onPress={() =>
                this.disableNotificationAndNavigate(
                  "Home",
                  { back: "home" },
                  true
                )
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
              style={{ height: 37, width: 30 }}
              source={require("../assets/profileActive.png")}
            />
          }
        />
        <PushNotification
          screen="profile"
          parentHandle={false}
          showPopUp={true}
          renderNotification={this.shouldRenderNotification}
        />
        <ScrollView style={{ backgroundColor: "#fff" }}>
          <View style={[styles.container, styles.center]}>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() =>
                  this.disableNotificationAndNavigate("ViewProfile", "", false)
                }
              >
                {this.display(displayImage)}
              </TouchableOpacity>
              <View style={{ alignItems: "center" }}>
                {this.state.fontLoaded ? (
                  <Text
                    style={[
                      styles.center,
                      styles.bold,
                      { fontFamily: "product-sans", fontSize: 25 }
                    ]}
                  >
                    {display}
                  </Text>
                ) : (
                  <Text style={[styles.center, styles.bold]}>{display}</Text>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 50
            }}
          >
            <TouchableOpacity>
              <Ionicons
                name="ios-settings"
                text="Edit Profile"
                size={50}
                style={{ color: "black" }}
                onPress={() =>
                  this.disableNotificationAndNavigate("Details", "", false)
                }
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="ios-camera"
                text="Add Media"
                size={50}
                style={{ color: "black", marginTop: 30 }}
                onPress={this.addImage.bind(this)}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="ios-information-circle"
                text="Edit Questionnaire"
                size={50}
                style={{ color: "black" }}
                onPress={() => {
                  this.disableNotificationAndNavigate("Questions", "", false);
                }}
              />
            </TouchableOpacity>
          </View>
          <Button
            style={{ margin: 20, alignItems: "center" }}
            title="Logout"
            buttonStyle={{
              width: 250,
              borderRadius: 40,
              backgroundColor: "#38EEB4"
            }}
            onPress={() => this.logoutButton()}
          />
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

export default connect(mapStateToProps)(Profile);
