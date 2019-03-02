import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet
} from "react-native";
import { Camera, Permissions } from "expo";
import { Ionicons } from "@expo/vector-icons";

const height = 60;

export class BottomComponent extends React.Component {
  constructor(props) {
    super(props);
    const width = Dimensions.get("window").width;
    this.state = {
      fadeAnim: new Animated.Value(height)
    };
  }

  isHidden = true;

  startAnimation = (toValue, duration) => {
    Animated.timing(this.state.fadeAnim, {
      toValue: toValue,
      duration: duration
    }).start();
  };

  _toggleSubview = toValue => {
    //This will animate the transalteY of the subview between 0 & height depending on its current state
    //height comes from the style below, which is the height of the subview.
    Animated.spring(this.state.fadeAnim, {
      toValue: toValue,
      velocity: 100,
      tension: 1,
      friction: 6
    }).start();
  };

  render() {
    const { fadeAnim } = this.state;
    const { isVisible, recyclable, recycleType } = this.props;
    const width = Dimensions.get("window").width;
    if (isVisible) {
      this._toggleSubview(0);
    } else {
      this._toggleSubview(height);
    }

    return (
      <Animated.View
        style={[
          {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            justifyContent: "center",
            height: height,
            position: "absolute",
            bottom: 0,
            width: "100%"
          },
          { transform: [{ translateY: fadeAnim }] },
          recyclable ? styles.recyclable : styles.nonrecyclable
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 24, fontWeight: "900", color: "#fff" }}>
            {recycleType
              ? recycleType
              : recyclable
              ? "Recyclable"
              : "Non-recyclable"}
          </Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  recyclable: {
    backgroundColor: "#4BB543"
  },
  nonrecyclable: {
    backgroundColor: "#ff0033"
  }
});
