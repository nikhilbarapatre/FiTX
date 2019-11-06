import React, { Component } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  SafeAreaView
} from "react-native";
import { Header, Icon } from "react-native-elements";
import { Font } from "expo";
import styles from "../styles";
import Swiper from "react-native-swiper";
import RootNavigator from "../navigations/RootNavigator";
import { PushNotification } from "./components";

class ShowUserProfile extends Component {
  constructor(props) {
    super(props);
    const profile =
      props.navigation.state.params && props.navigation.state.params.profile;
    const images =
      props.navigation.state.params && props.navigation.state.params.images;
    const from =
      props.navigation.state.params && props.navigation.state.params.from;

    this.state = {
      userProfile: profile,
      userImages: images,
      from: from,
      fontLoaded: false
    };

    this.goBack = this.goBack.bind(this);

    this.notificationActive = true;
    this.screenName = "showuser";
    this.shouldRenderNotification = this.shouldRenderNotification.bind(this);
    this.disableNotificationAndNavigate = this.disableNotificationAndNavigate.bind(
      this
    );
  }

  async componentDidMount() {
    await Font.loadAsync({
      "product-sans": require("../assets/product-sans/Product-Sans-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
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

  goBack = () => {
    if (this.state.from == "chat") {
      this.disableNotificationAndNavigate("Chat", {
        back: this.state.from
      });
    } else if (this.state.from == "home") {
      this.disableNotificationAndNavigate("Home", {
        back: this.state.from
      });
    }
  };

  render() {
    let work = "";
    let about = "";
    let display = this.state.userProfile.first_name;
    if (this.state.userProfile.age != null) {
      display += ", " + this.state.userProfile.age;
    }
    if (this.state.userProfile.job_title && this.state.userProfile.company) {
      work =
        this.state.userProfile.job_title +
        " at " +
        this.state.userProfile.company;
    } else if (this.state.userProfile.job_title) {
      work = this.state.userProfile.job_title;
    } else if (this.state.userProfile.company) {
      work = this.state.userProfile.company;
    }
    if (this.state.userProfile.bio) {
      about = this.state.userProfile.bio;
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Header
          backgroundColor="#fff"
          leftComponent={
            <TouchableOpacity>
              <Icon
                size={40}
                name={"chevron-left"}
                onPress={() => this.goBack()}
              />
            </TouchableOpacity>
          }
          centerComponent={
            this.state.fontLoaded ? (
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  fontFamily: "product-sans"
                }}
              >
                Profile
              </Text>
            ) : (
              <Text style={{ fontSize: 22, fontWeight: "700" }}>Profile</Text>
            )
          }
        />
        <PushNotification
          screen="showuser"
          parentHandle={false}
          showPopUp={true}
          renderNotification={this.shouldRenderNotification}
        />
        <ScrollView style={{ backgroundColor: "#fff" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: 500
            }}
          >
            <Swiper>
              {this.state.userImages.map(img => {
                return (
                  <Image
                    style={styles.userCard}
                    source={{ uri: img }}
                    key={img.toString()}
                  />
                );
              })}
            </Swiper>
          </View>
          <View style={{ marginHorizontal: 20, marginTop: 10 }}>
            {this.state.fontLoaded ? (
              <Text
                style={{
                  fontFamily: "product-sans",
                  fontSize: 35,
                  fontWeight: "700",
                  color: "#434343"
                }}
              >
                {display}
              </Text>
            ) : (
              <Text
                style={{ fontSize: 35, fontWeight: "700", color: "#434343" }}
              >
                {display}
              </Text>
            )}

            <Text style={{ marginTop: 10, fontSize: 18, color: "#9C979B" }}>
              {work}
            </Text>
            <Text style={{ marginTop: 5, fontSize: 18, color: "#9C979B" }}>
              {this.state.userProfile.school}
            </Text>
            {this.state.fontLoaded ? (
              <Text
                style={{
                  marginTop: 35,
                  fontFamily: "product-sans",
                  fontSize: 25,
                  color: "#434343"
                }}
              >
                About
              </Text>
            ) : (
              <Text style={{ marginTop: 35, fontSize: 25, color: "#434343" }}>
                About
              </Text>
            )}
            <Text style={{ fontSize: 18, color: "#9C979B", marginBottom: 50 }}>
              {about}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default ShowUserProfile;
