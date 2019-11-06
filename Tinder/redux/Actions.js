//This file contains the actions that is required by the redux.
import { ImagePicker, Permissions } from "expo";
import { Alert } from "react-native";
import address from "../config/address";
import axios from "axios";

export function login(user, token, pushBody) {
  return function(dispatch) {
    let params = {
      id: user.profile.userId,
      firstName: user.profile.first_name,
      lastName: user.profile.last_name,
      email: user.email,
      bio: user.profile.bio,
      age: user.profile.age,
      gender: user.profile.gender,
      school: user.profile.school,
      company: user.profile.company,
      jobTitle: user.profile.job_title,
      images: [],
      swipes: [],
      questions: [],
      location: user.profile.location,
      deviceToken: pushBody.device_token,
      questionnaireUpdated: false
    };
    token: token;

    //<=========Make API requests here to create a new user or update the profile made by the user==========>
    dispatch({
      type: "LOGIN",
      user: params,
      loggedIn: true,
      token: token
    });
    axios
      .post(address + "/api/users/me/device", pushBody, { headers: token })
      .catch(err => console.log(err));
  };
}

export function updateProfile(user, profile, token) {
  return function(dispatch) {
    let params = {
      id: user.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: user.email,
      age: profile.age,
      gender: profile.gender,
      bio: profile.bio,
      school: profile.school,
      company: profile.company,
      jobTitle: profile.job_title,
      images: user.images,
      questions: user.questions,
      questionnaireUpdated: false
    };
    token: token;
    dispatch({
      type: "UPDATE",
      user: params,
      token: token
    });
  };
}

export function logout(pushBody, token) {
  return function(dispatch) {
    fetch(address + "/api/users/me/device", {
      method: "delete",
      body: JSON.stringify(pushBody),
      headers: token
    })
      // .then(res => console.log(res.json()))
      .then(res => dispatch({ type: "LOGOUT", loggedIn: false }))
      .catch(err => {
        console.log(err);
        Alert.alert(
          "Oops! Something went wrong",
          "Please try again.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      });
  };
}

export function uploadImages(images, headers) {
  return async function(dispatch) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      ImagePicker.launchImageLibraryAsync({ allowsEditing: false }).then(
        function(result) {
          var array = images;

          if (array === undefined) {
            array = [];
          }

          if (result.uri != undefined) {
            const file = {
              uri: result.uri,
              name: result.uri,
              type: "image/png"
            };
            const formData = new FormData();
            formData.append("image", file);

            fetch(address + "/api/users/me/pictures", {
              method: "POST",
              body: formData,
              headers: headers
            })
              .then(res => res.json())
              .then(res => {
                if (res.success !== true) {
                  Alert.alert(
                    "Oops! Something went wrong",
                    "Please try again.",
                    [{ text: "OK" }],
                    { cancelable: false }
                  );
                } else {
                  Alert.alert("Uploaded successfully!", "", [{ text: "OK" }], {
                    cancelable: false
                  });
                  if (array[0].id === -1) {
                    array.shift();
                  }
                  array.push(res.picture);
                  dispatch({ type: "UPLOAD_IMAGES", payload: array });
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
          }
        }
      );
    } else {
      throw new Error("Location permission not granted");
    }
  };
}

export function getImages(images) {
  return function(dispatch) {
    dispatch({ type: "GET_IMAGES", payload: images });
  };
}

export function getQuestionnaire(ques) {
  return function(dispatch) {
    dispatch({ type: "QUESTIONS", payload: ques });
  };
}

export function submit(questions) {
  return function(dispatch) {
    dispatch({ type: "QUESTIONS", payload: questions });
  };
}

export function setQuestionnaireUpdated(questionnaireUpdated) {
  return function(dispatch) {
    dispatch({ type: "QUESTIONS_UPDATED", payload: questionnaireUpdated });
  };
}

export function deleteImages(images, token, id) {
  return function(dispatch) {
    let img = images;
    Alert.alert(
      "Are you sure you want to Delete?",
      "",
      [
        {
          text: "Ok",
          onPress: () =>
            fetch(address + "/api/users/me/pictures/" + id, {
              method: "DELETE",
              headers: token
            })
              .then(res => res.json())
              .then(res => {
                img = res.pictures;
                dispatch({ type: "UPLOAD_IMAGES", payload: img });
              })
              .catch(err => {
                console.log(err);
                Alert.alert(
                  "Oops! Something went wrong",
                  "Please try again.",
                  [{ text: "OK" }],
                  { cancelable: false }
                );
              })
        },
        { text: "Cancel" }
      ],
      { cancelable: true }
    );
  };
}
