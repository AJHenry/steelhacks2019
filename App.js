import React from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Camera, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator />
        </View>
      );
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "column"
              }}
            >
              <View />
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center"
                }}
                onPress={() => {
                  console.log("Pressed");
                }}
              />
              <View style={{height: 100, backgroundColor: '#fff'}}>
                <Text>Bottom Bar</Text>
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
