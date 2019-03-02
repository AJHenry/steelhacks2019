import React from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Camera, Permissions } from "expo";
import { BottomComponent } from "./BottomComponent";
import { TopComponent } from "./TopComponent";

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isShowing: true
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission, isShowing } = this.state;
    if (hasCameraPermission === null) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
          <Text>Loading cycler</Text>
        </View>
      );
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#000",
              flexDirection: "column"
            }}
          >
            <TopComponent
              isVisible={isShowing}
              recycleText="Fruit"
              recyclable
            />
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center"
              }}
              onPress={() => {
                console.log("Pressed");
                this.setState({ isShowing: !isShowing });
              }}
            />
            <BottomComponent isVisible={isShowing} recyclable />
          </View>
        </View>
      );
    }
  }
}
