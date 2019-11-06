import React, { Component } from "react";
import { TouchableOpacity, ImageBackground, View, Text } from "react-native";
import { Font } from "expo";
import styles from "../../styles";

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = { num: 0, fontLoaded: false };
  }

  async componentDidMount() {
    await Font.loadAsync({
      "product-sans": require("../../assets/product-sans/Product-Sans-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }
  nextPhoto() {
    var num = this.state.num;
    var length = this.props.images.length - 1;
    if (num >= length) {
      this.setState({ num: 0 });
    } else {
      num += 1;
      this.setState({ num: num });
    }
  }

  render() {
    let display = this.props.profile.first_name;
    if (this.props.profile.age != null) {
      display += ", " + this.props.profile.age;
    }
    return (
      <TouchableOpacity onPress={() => this.nextPhoto()}>
        <ImageBackground
          style={styles.card}
          source={{ uri: this.props.images[this.state.num] }}
        >
          <View style={styles.cardDescription}>
            <View style={styles.cardInfo}>
              {this.state.fontLoaded ? (
                <Text
                  style={{
                    fontFamily: "product-sans",
                    fontSize: 35,
                    fontWeight: "bold",
                    color: "#fff"
                  }}
                >
                  {display}
                </Text>
              ) : (
                <Text style={styles.homeDisplay}>{display}</Text>
              )}
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

export { Cards };
