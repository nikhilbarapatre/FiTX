import React from "react";
import { StyleSheet } from "react-native";
var Dimensions = require("Dimensions");
var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  displayImg: {
    width: 170,
    height: 170,
    borderRadius: 85,
    margin: 10,
    backgroundColor: "#fff"
  },
  img: {
    width: 105,
    height: 155,
    borderRadius: 10,
    margin: 10,
    backgroundColor: "#fff"
  },
  imgRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    padding: 15
  },
  bold: {
    padding: 10,
    fontSize: 18,
    fontWeight: "bold"
  },
  labelStyle: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f4f4f"
  },
  card: {
    flex: 1,
    width: deviceWidth * 0.9,
    height: deviceHeight * 0.7,
    marginTop: 5,
    borderRadius: 10
  },
  cardDescription: {
    padding: 15,
    justifyContent: "flex-end",
    flex: 1
  },
  cardInfo: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 5
  },
  userCard: {
    marginTop: 5,
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 10
  },
  chatImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
    backgroundColor: "#fff"
  },
  viewImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff"
  },
  inLine: {
    flexWrap: "wrap",
    flexDirection: "row"
  },
  homeDisplay: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff"
  }
});

module.exports = styles;
