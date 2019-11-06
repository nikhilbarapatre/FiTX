import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import { Font } from "expo";
import styles from "../../styles";

class NoCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      "product-sans": require("../../assets/product-sans/Product-Sans-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{ height: 150, width: 150 }}
          source={require("../../assets/bike.png")}
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
              Can't find anyone?
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 34,
                fontWeight: "700",
                color: "#434343"
              }}
            >
              Can't find anyone?
            </Text>
          )}
          <Text style={{ marginTop: 10, color: "#9C979B" }}>
            We're working on finding your perfect workout partner
          </Text>
        </View>
      </View>
    );
  }
}

export { NoCards };
