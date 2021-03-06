import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions
} from "react-native";
import { Camera, Permissions } from "expo";
import { BottomComponent } from "./BottomComponent";
import { TopComponent } from "./TopComponent";
import Environment from "./environment.config";
import ITEMS from "./items";

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isShowing: false,
    imageUri: false
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
      this.setState({
        isAnalyzingPhoto: true,
      });

      const photo = await this.camera.takePictureAsync({
        base64: true
      });

      this.setState({
        imageUri: photo.uri
      });

      let matches = await this.getMatches(photo.base64, 10);
      matches = await matches.json();
      const result = await this.getType(matches.responses[0].labelAnnotations);
      this.setState({
        isAnalyzingPhoto: false,
        isShowing: true,
        loadingGoogle: false,
        recyclable: result.type === "RECYCLE",
        compostable: result.type === "COMPOST",
        special: result.type === "SPECIAL",
        text: result.items[0],
        imageUri: photo.uri
      });
    }
  };

  getType = async matches => {
    const lowered = matches.map(m => m.description.toLowerCase());
    const recycle = lowered.filter(l => {
        if ((ITEMS["RECYCLE"].includes(l))) {
            return true;
        }
        const words = l.split(' ');
        for (word of words) {
            if (ITEMS["RECYCLE"].includes(word)) {
                return true
            }
        }
        return false;
    });
    const compost = lowered.filter(l => {
        if ((ITEMS["COMPOST"].includes(l))) {
            return true;
        }
        const words = l.split(' ');
        for (word of words) {
            if (ITEMS["COMPOST"].includes(word)) {
                return true
            }
        }
        return false;
    });
    const special = lowered.filter(l => {
         if ((ITEMS["SPECIAL"].includes(l))) {
            return true;
        }
        const words = l.split(' ');
        for (word of words) {
            if (ITEMS["SPECIAL"].includes(word)) {
                return true
            }
        }
        return false;
    });

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
    const { width, height } = Dimensions.get("window");
    const {
      hasCameraPermission,
      isShowing,
      recyclable,
      text,
      imageUri,
      compostable,
      isAnalyzingPhoto,
      special
    } = this.state;
    if (hasCameraPermission === null) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
          <Text>Loading cycler</Text>
        </View>
      );
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (imageUri) {
      let loadingComponent = (
      <View style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.78)"
      }}>
        <Text style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "white",
          marginBottom: 20
        }}>Analyzing Image</Text>
        <ActivityIndicator size="large" color="white"></ActivityIndicator>
      </View>
      )
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "column"
            }}
          >
            <TopComponent
              isVisible={isShowing}
              recycleText={text}
              recyclable={recyclable}
              compostable={compostable}
              special={special}
            />
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center"
              }}
              onPress={() => {
                // this.setState({ isShowing: !isShowing });
                this.setState({ imageUri: null, isShowing: false });
              }}
            >
              { isAnalyzingPhoto ? loadingComponent : null}
              <Image style={{ width, height }} source={{ uri: imageUri }} />
            </TouchableOpacity>
            <BottomComponent
              isVisible={isShowing}
              recyclable={recyclable}
              compostable={compostable}
              special={special}
              givenHeight={special ? 400 : 120}
            />
          </View>
        </View>
      );
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
                backgroundColor: "transparent",
                flexDirection: "column"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center"
                }}
                onPress={() => {
                  // this.setState({ isShowing: !isShowing });
                  this.snap();
                }}
              />
            </View>
          </Camera>
        </View>
      );
    }
  }
}
