import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Header, Icon } from "react-native-elements";
import { Font } from "expo";
import { updateProfile, deleteImages } from "../redux/Actions";
import address from "../config/address";
import { Input } from "./components";
import { connect } from "react-redux";
import styles from "../styles";

class AddDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      age: this.props.user.age,
      bio: this.props.user.bio,
      school: this.props.user.school,
      company: this.props.user.company,
      jobTitle: this.props.user.jobTitle,
      loading: false,
      error: "",
      fontLoaded: false
    };

    this.set = this.set.bind(this);
  }
  async componentDidMount() {
    await Font.loadAsync({
      "product-sans": require("../assets/product-sans/Product-Sans-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  step2func() {
    //will call the API to store details about the user
    this.setState({ loading: true });
    const user = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      age: this.state.age,
      bio: this.state.bio,
      school: this.state.school,
      company: this.state.company,
      job_title: this.state.jobTitle
    };

    let headers;

    headers = this.props.token;

    axios
      .put(address + "/api/users/me/profile", user, {
        headers: headers
      })
      .then(res => this.onSuccess(user, headers))
      .then(this.props.navigation.navigate("Profile"));
  }

  onSuccess(profile, headers) {
    this.props.dispatch(updateProfile(this.props.user, profile, headers));
  }

  set(key, val) {
    this.setState({
      [key]: val
    });
  }

  deleteImage(id) {
    this.props.dispatch(
      deleteImages(this.props.user.images, this.props.token, id)
    );
  }

  onFail() {
    this.setState({ loading: false });
    Alert.alert(
      "Oops!",
      "Something went wrong, please try again.",
      [{ text: "OK" }],
      { cancelable: false }
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.props.user.age) {
      this.props.user.age = "";
    }
    let imgArray = this.props.user.images;
    if (imgArray === undefined) {
      imgArray = [];
    }
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
            <TouchableOpacity style={{ marginTop: 8 }}>
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
                  fontFamily: "product-sans",
                  fontSize: 22,
                  fontWeight: "700"
                }}
              >
                Edit Profile
              </Text>
            ) : (
              <Text style={{ fontSize: 22, fontWeight: "700" }}>
                Edit Profile
              </Text>
            )
          }
        />
        <ScrollView>
          <View style={styles.imgRow}>
            {imgArray.map((im, key) => {
              return im.id !== -1 ? (
                <TouchableOpacity
                  key={im.id}
                  onPress={this.deleteImage.bind(this, im.id)}
                >
                  <Image
                    style={styles.img}
                    source={{
                      uri: im.url
                    }}
                    key={im.id}
                  />
                  <View
                    style={{
                      position: "absolute",
                      left: 80,
                      top: 130
                    }}
                  >
                    <Icon
                      size={15}
                      reverse
                      name="close"
                      type="font-awesome"
                      color="#38EEB4"
                    />
                  </View>
                </TouchableOpacity>
              ) : null;
            })}
          </View>
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "flex-end",
              paddingHorizontal: 20
            }}
            scrollEnabled={false}
          >
            <Text style={{ fontSize: 18, color: "#9C979B" }}>First Name</Text>
            <Input
              placeHolder="Ex: John"
              value={this.props.user.firstName}
              keyboardType="default"
              onChangeText={firstName => this.set("firstName", firstName)}
            />
            <Text style={{ fontSize: 18, color: "#9C979B" }}>Last Name</Text>
            <Input
              placeHolder="Ex: Doe"
              value={this.props.user.lastName}
              keyboardType="default"
              onChangeText={lastName => this.set("lastName", lastName)}
            />
            <Text style={{ fontSize: 18, color: "#9C979B" }}>Age</Text>
            <Input
              placeHolder="Ex: 21"
              value={this.props.user.age.toString()}
              keyboardType="number-pad"
              onChangeText={age => this.set("age", age)}
            />

            {/* <Text style={{ fontSize: 18, color: "#9C979B" }}>Gender</Text>
            <Input
              placeHolder="Ex: Male"
              value={this.props.user.gender}
              keyboardType="default"
              onChangeText={gender => this.set("gender", gender)}
            /> */}

            <Text style={{ fontSize: 18, color: "#9C979B" }}>School</Text>
            <Input
              placeHolder="Ex: USF"
              value={this.props.user.school}
              keyboardType="default"
              onChangeText={school => this.set("school", school)}
            />

            <Text style={{ fontSize: 18, color: "#9C979B" }}>Company</Text>
            <Input
              placeHolder="Ex: Google"
              value={this.props.user.company}
              keyboardType="default"
              onChangeText={company => this.set("company", company)}
            />

            <Text style={{ fontSize: 18, color: "#9C979B" }}>Job Title</Text>
            <Input
              placeHolder="Ex: Sr. Engineer"
              value={this.props.user.jobTitle}
              keyboardType="default"
              onChangeText={jobTitle => this.set("jobTitle", jobTitle)}
            />
            <Text style={{ fontSize: 18, color: "#9C979B" }}>About Me</Text>
            <Input
              placeHolder="Write something about yourself"
              value={this.props.user.bio}
              multiline={true}
              numberOfLines={5}
              blurOnSubmit={true}
              keyboardType="default"
              onChangeText={bio => this.set("bio", bio)}
            />
          </KeyboardAwareScrollView>

          <View
            style={{
              paddingBottom: 10,
              alignItems: "center"
            }}
          >
            <Button
              style={{ margin: 20 }}
              title="Done"
              buttonStyle={{
                width: 250,
                borderRadius: 40,
                backgroundColor: "#38EEB4"
              }}
              onPress={this.step2func.bind(this)}
            />
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

export default connect(mapStateToProps)(AddDetails);
