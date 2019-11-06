import React, { Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from "react-native";
import { Header, Icon } from "react-native-elements";
import axios from "axios";
import address from "../config/address";
import { Location, Permissions } from "expo";
import { connect } from "react-redux";
import SwipeCards from "react-native-swipe-cards";
import { Cards, NoCards, PushNotification } from "./components";
import { setQuestionnaireUpdated } from "../redux/Actions";

const UPDATE_DELAY = 3000;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      errorMessage: null,
      cards: []
    };

    this.notificationActive = true;
    this.screenName = "home";
    this.shouldRenderNotification = this.shouldRenderNotification.bind(this);
    this.disableNotificationAndNavigate = this.disableNotificationAndNavigate.bind(
      this
    );
  }
  componentWillMount() {
    if (this.props.user.location === null) {
      this._getLocationAsync();
    } else {
      this.getNewCards();
    }

    this.timeoutCheck = setTimeout(
      this.detectQuestionnaireChange,
      UPDATE_DELAY
    );
  }

  detectQuestionnaireChange = () => {
    if (this.props.user.questionnaireUpdated) {
      this.getNewCards();
    }
    this.timeoutCheck = setTimeout(
      this.detectQuestionnaireChange,
      UPDATE_DELAY
    );
  };

  getNewCards = () => {
    this.getCards(this.props.token, this.props.user.id);
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

  _getLocationAsync = () => {
    Permissions.askAsync(Permissions.LOCATION)
      .then(data => {
        if (data.status === "granted") {
          Location.getCurrentPositionAsync({}).then(locationData => {
            // this.setState({ locationData });
            const body = {
              userId: this.props.user.id,
              lat: locationData.coords.latitude,
              long: locationData.coords.longitude
            };
            axios
              .post(address + "/api/location", body, {
                headers: this.props.token
              })
              .then(res => {
                if (res.data.success) {
                  this.getCards(this.props.token, this.props.user.id);
                }
              })
              .catch(err => {
                Alert.alert(
                  "Oops! Something went wrong",
                  "Please try again.",
                  [{ text: "OK" }],
                  { cancelable: false }
                );
              });
          });
        } else {
          this.getCards(this.props.token, this.props.user.id);
        }
      })
      .catch(() => {
        this.setState({
          errorMessage: "Permission to access location was denied"
        });
      });
  };

  getCards(token, id) {
    fetch(address + "/api/cards/" + id, {
      method: "GET",
      headers: token
    })
      .then(res => res.json())
      .then(res => {
        if (res.success === true) {
          this.setState({ cards: res.cards });
        }
      })
      .then(() => {
        this.props.dispatch(setQuestionnaireUpdated(false));
      });
  }

  handleYes(card) {
    const body = {
      userId: this.props.user.id,
      swipeId: card.id,
      like: true
    };
    axios
      .post(address + "/api/swipes", body, { headers: this.props.token })
      .catch(error => {
        this.swipeError();
      });
  }
  yup() {
    let temp;
    temp = this.refs["swiper"].getCurrentCard();
    this.refs["swiper"]._forceRightSwipe();
    this.handleYes(temp);
  }

  swipeError = () => {
    this.refs["swiper"]._goToPrevCard();
    Alert.alert(
      "Oops! Something went wrong",
      "Please try again.",
      [{ text: "OK" }],
      { cancelable: false }
    );
  };

  handleNo(card) {
    const body = {
      userId: this.props.user.id,
      swipeId: card.id,
      like: false
    };
    axios
      .post(address + "/api/swipes", body, { headers: this.props.token })
      .catch(error => {
        this.swipeError();
      });
  }

  nope() {
    let temp;
    temp = this.refs["swiper"].getCurrentCard();
    this.refs["swiper"]._forceLeftSwipe();
    this.handleNo(temp);
  }

  goToUserProfile() {
    let temp;

    temp = this.refs["swiper"].getCurrentCard();
    temp.from = "home";

    this.disableNotificationAndNavigate("ShowUser", temp);
  }

  showIcons() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 40,
          paddingVertical: 20
        }}
      >
        <TouchableOpacity>
          <Icon
            reverse
            name="close"
            type="font-awesome"
            color="red"
            onPress={() => this.nope()}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            reverse
            name="ios-person"
            type="ionicon"
            color="#787878"
            onPress={() => this.goToUserProfile()}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            reverse
            name="ios-heart"
            type="ionicon"
            color="#38EEB4"
            onPress={() => this.yup()}
          />
        </TouchableOpacity>
      </View>
    );
  }

  disableNotificationAndNavigate(page, extra) {
    this.notificationActive = false;

    let navigationCheck;

    navigationCheck = this.props.navigation.state.params;

    if (navigationCheck && navigationCheck.back) {
      if (navigationCheck.back == this.screenName) {
        navigationCheck.back = "";
      }
    }

    const { navigate } = this.props.navigation;

    navigate(page, extra);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Header
          backgroundColor="#fff"
          leftComponent={
            <TouchableOpacity
              onPress={() => this.disableNotificationAndNavigate("View", "")}
            >
              <Image
                style={{ height: 37, width: 30 }}
                source={require("../assets/profileInactive.png")}
              />
            </TouchableOpacity>
          }
          rightComponent={
            <TouchableOpacity
              onPress={() => this.disableNotificationAndNavigate("Matches", "")}
            >
              <Image
                style={{ height: 37, width: 48 }}
                source={require("../assets/chatInactive.png")}
              />
            </TouchableOpacity>
          }
          centerComponent={
            <Image
              style={{ height: 40, width: 65 }}
              source={require("../assets/homeActive.png")}
            />
          }
        />
        <PushNotification
          screen="home"
          parentHandle={false}
          showPopUp={true}
          renderNotification={this.shouldRenderNotification}
        />
        <SwipeCards
          ref={"swiper"}
          cards={this.state.cards}
          stack={false}
          renderCard={cardData => <Cards {...cardData} />}
          renderNoMoreCards={() => <NoCards />}
          showYup={true}
          showNope={true}
          handleYup={() => this.yup()}
          handleNope={() => this.nope()}
        />
        {this.state.cards.length != 0 ? this.showIcons() : null}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    cards: state.cards,
    token: state.token
  };
}
export default connect(mapStateToProps)(Home);
