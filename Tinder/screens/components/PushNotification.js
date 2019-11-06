import React, { Component } from "react";
import { Notifications } from "expo";
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogButton
} from "react-native-popup-dialog";
import { Text, Image } from "react-native";

class PushNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: {},
      visible: false
    };

    this._handleNotification = this._handleNotification.bind(this);
    this.renderAnimation = this.renderAnimation.bind(this);

    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  componentWillUnmount() {
    this._notificationSubscription.remove();
  }

  renderAnimation() {
    if (this.state.notification.data.type === "match") {
      return (
        <Image
          style={{
            marginTop: 15,
            justifyContent: "center",
            alignSelf: "center",
            height: 200,
            width: 200
          }}
          source={require("../../assets/run.gif")}
        />
      );
    } else if (this.state.notification.data.type === "chat") {
      return (
        <Image
          style={{
            justifyContent: "center",
            alignSelf: "center",
            height: 200,
            width: 200
          }}
          source={require("../../assets/chat.gif")}
        />
      );
    }
    return null;
  }

  _handleNotification = notification => {
    if (
      this.props.renderNotification() &&
      notification.hasOwnProperty("data")
    ) {
      let parentHandleNotification;
      parentHandleNotification =
        this.props.screen === notification.data.type && this.props.parentHandle;

      console.log(parentHandleNotification);

      this.setState({
        notification: notification,
        visible: !parentHandleNotification
      });

      if (parentHandleNotification) {
        this.props.parentHandler(notification);
      }
    }
  };

  renderDialog() {
    let data;

    data = this.state.notification.data;

    return (
      <Dialog
        visible={this.state.visible}
        onTouchOutside={() => {
          this.setState({ visible: false });
        }}
        actions={[
          <DialogButton
            key={data.toString()}
            buttonStyle={{ height: 10, width: 10, color: "#38EEB4" }}
            text="DISMISS"
            onPress={() => this.setState({ visible: false })}
          />
        ]}
      >
        <DialogContent
          style={{
            backgroundColor: "#fff"
          }}
        >
          {this.renderAnimation()}

          <Text style={{ margin: 15 }}>{data.body}</Text>
        </DialogContent>
      </Dialog>
    );
  }

  render() {
    if (this.state.notification.hasOwnProperty("data")) {
      return this.renderDialog();
    } else {
      return null;
    }
  }
}

export { PushNotification };
