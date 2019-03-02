import React from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Camera, Permissions } from "expo";
import { BottomComponent } from "./BottomComponent";
import { TopComponent } from "./TopComponent";
import Environment from "./environment.config";
import ITEMS from "./items";

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isShowing: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  getMatches = async (base64, results) => {
    return fetch(
      "https://vision.googleapis.com/v1/images:annotate?key=" +
        Environment["GOOGLE_CLOUD_VISION_API_KEY"],
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64
              },
              features: [
                {
                  type: "LABEL_DETECTION",
                  maxResults: results
                }
              ]
            }
          ]
        })
      }
    );
  };

  snap = async () => {
    if (this.camera) {
      
      const photo = await this.camera.takePictureAsync({
        base64: true
      });


      let matches = await this.getMatches(photo.base64, 10);
      matches = await matches.json();
      const result = await this.getType(matches.responses[0].labelAnnotations);
      this.setState({
        isShowing: true,
        recyclable: result.type === "RECYCLE" ? true : false,
        text: result.items[0]
      });
    }
  };

  getType = async matches => {
    const lowered = matches.map(m => m.description.toLowerCase());
    const recycle = lowered.filter(l => ITEMS["RECYCLE"].includes(l));
    const compost = lowered.filter(l => ITEMS["COMPOST"].includes(l));
    const special = lowered.filter(l => ITEMS["SPECIAL"].includes(l));

    if (recycle.length > 0)
      return {
        type: "RECYCLE",
        items: recycle
      };

    if (compost.length > 0)
      return {
        type: "COMPOST",
        items: compost
      };

    if (special.length > 0)
      return {
        type: "SPECIAL",
        items: special
      };

    return {
      type: "GARBAGE",
      items: lowered
    };
  };

  render() {
    const { hasCameraPermission, isShowing, recyclable, text } = this.state;
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
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: "column"
              }}
            >
              <TopComponent
                isVisible={isShowing}
                recycleText={text}
                recyclable={recyclable}
              />
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center"
                }}
                onPress={() => {
                  // this.setState({ isShowing: !isShowing });
                  this.snap();
                }}
              ></TouchableOpacity>
              <BottomComponent isVisible={isShowing} recyclable={recyclable} />
            </View>
          </Camera>
        </View>
      );
    }
  }
}
