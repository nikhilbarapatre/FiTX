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
import { connect } from "react-redux";
import { Font } from "expo";
import styles from "../styles";
import Swiper from "react-native-swiper";
import RootNavigator from "../navigations/RootNavigator";

class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      "product-sans": require("../assets/product-sans/Product-Sans-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    let imgArray = this.props.user.images;
    let work = "";
    let display = this.props.user.firstName;
    const { navigate } = this.props.navigation;
    if (this.props.user.age != null) {
      display += ", " + this.props.user.age;
    }
    if (imgArray === undefined || imgArray.length === 0) {
      imgArray = [];
    }
    if (this.props.user.jobTitle && this.props.user.company) {
      work = this.props.user.jobTitle + " at " + this.props.user.company;
    } else if (this.props.user.jobTitle) {
      work = this.props.user.jobTitle;
    } else if (this.props.user.company) {
      work = this.props.user.company;
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
                onPress={() => navigate("Profile")}
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
              {imgArray.map(im => {
                if (im.id === -1) {
                  return null;
                } else {
                  return (
                    <Image
                      style={styles.userCard}
                      source={{
                        uri: im.url
                      }}
                      key={im.toString()}
                    />
                  );
                }
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
              {this.props.user.school}
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
              {this.props.user.bio}
            </Text>
          </View>
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

export default connect(mapStateToProps)(ViewProfile);
