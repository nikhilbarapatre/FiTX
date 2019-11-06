import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import axios from "axios";
import { CheckBox, Header, Icon, Button } from "react-native-elements";
import { Font } from "expo";
import address from "../config/address";
import questionOptions from "../applicationJSON/questionOptions";
import { getQuestionnaire, submit, setQuestionnaireUpdated } from "../redux/Actions";
import { connect } from "react-redux";

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkBoxChecked: this.props.user.questions,
      questionsLoaded: false,
      fontLoaded: false
    };

    this.setQuestionOption = this.setQuestionOption.bind(this);
  }

  componentWillMount = () => {
    let questions;

    questions = this.props.user.questions;

    if (questions.length == 0) {
      this.fetchQuestions(questions);
    } else {
      this.setState({
        questionsLoaded: true
      });
    }
  };

  async componentDidMount() {
    await Font.loadAsync({
      "product-sans": require("../assets/product-sans/Product-Sans-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  onSubmit() {
    this.props.dispatch(setQuestionnaireUpdated(true));
    this.props.navigation.navigate("Profile");
  }

  fetchQuestions = ques => {
    fetch(address + "/api/questions/view/" + this.props.user.id, {
      method: "GET",
      headers: this.props.token
    })
      .then(res => res.json())
      .then(res => {
        res.map(obj => {
          obj.options = questionOptions[obj.questionId];
          obj.checked = obj.answer;
          ques[obj.questionId] = obj;
        });

        this.props.dispatch(getQuestionnaire(ques));
        this.setState({
          questionsLoaded: true
        });
      })
      .catch(err => console.log(err));
  };

  onFail() {
    Alert.alert(
      "Oops!",
      "Something went wrong, please try again.",
      [{ text: "OK" }],
      { cancelable: false }
    );
  }

  setQuestionOption(key, value) {
    let tempCheckBoxChecked;

    tempCheckBoxChecked = this.state.checkBoxChecked;
    if (tempCheckBoxChecked[key].checked == value) {
      tempCheckBoxChecked[key].checked = "";
    } else {
      tempCheckBoxChecked[key].checked = value;
    }

    let answerObj = {
      questionId: key,
      userId: this.props.user.id,
      answer: this.state.checkBoxChecked[key].checked
    };

    this.postAnswers(tempCheckBoxChecked, answerObj);
  }

  postAnswers = (tempCheckBoxChecked, answerObj) => {
    axios
      .post(address + "/api/questions/answer", answerObj, {
        headers: this.props.token
      })
      .then(res => {
        this.setState({
          checkBoxChecked: tempCheckBoxChecked
        });

        let questions;

        questions = this.props.user.questions;

        questions[answerObj.questionId].checked = answerObj.answer;

        this.props.dispatch(submit(questions));
      })
      .catch(err => console.log(err));
  };

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
                Questionnaire
              </Text>
            ) : (
              <Text style={{ fontSize: 22, fontWeight: "700" }}>
                Questionnaire
              </Text>
            )
          }
        />
        <ScrollView>
          {this.state.checkBoxChecked.map(obj => {
            return (
              <View key={obj.questionId}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    marginLeft: 10,
                    marginTop: 10
                  }}
                >
                  {obj.question}
                </Text>

                {obj.options.map(option => {
                  let check;

                  check = false;

                  if (option == obj.checked) {
                    check = true;
                  }

                  return (
                    <CheckBox
                      containerStyle={{ backgroundColor: "#fff" }}
                      textStyle={{
                        fontSize: 15
                      }}
                      title={option}
                      checked={check}
                      onPress={() =>
                        this.setQuestionOption(obj.questionId, option)
                      }
                      key={option.toString()}
                    />
                  );
                })}
              </View>
            );
          })}
          <View
            style={{
              flex: 1,
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
              onPress={this.onSubmit.bind(this)}
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

export default connect(mapStateToProps)(Questions);
