//This file contains the reducers that are required by the redux.

export default (Reducers = (
  state = {
    loggedIn: false,
    user: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      aboutMe: "",
      age: "",
      gender: "",
      school: "",
      company: "",
      jobTitle: "",
      images: [],
      swipes: [],
      questions: [],
      location: {},
      deviceToken: "",
      questionnaireUpdated: false
    },
    token: ""
  },
  action
) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        user: action.user,
        loggedIn: action.loggedIn,
        token: action.token
      };
    }
    case "LOGOUT": {
      return { ...state, loggedIn: action.loggedIn };
    }
    case "UPLOAD_IMAGES": {
      return { ...state, user: { ...state.user, images: action.payload } };
    }
    case "GET_IMAGES": {
      return { ...state, user: { ...state.user, images: action.payload } };
    }
    case "QUESTIONS": {
      return { ...state, user: { ...state.user, questions: action.payload } };
    }
    case "UPDATE": {
      return { ...state, user: action.user, token: action.token };
    }
    case "QUESTIONS_UPDATED": {
      return {
        ...state,
        user: { ...state.user, questionnaireUpdated: action.payload }
      };
    }
  }
  return state;
});
