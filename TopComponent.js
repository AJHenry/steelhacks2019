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

const height = 70;

export class TopComponent extends React.Component {
  constructor(props) {
    super(props);
    const width = Dimensions.get("window").width;
    this.state = {
      fadeAnim: new Animated.Value(-height)
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
      velocity: height,
      tension: 1,
      friction: 6
    }).start();
  };

  render() {
    const { fadeAnim } = this.state;
    const { isVisible, recycleText, recyclable } = this.props;
    const width = Dimensions.get("window").width;
    if (isVisible) {
      this._toggleSubview(0);
    } else {
      this._toggleSubview(-height);
    }

    return (
      <Animated.View
        style={[
          {
            paddingTop: 25,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            height: height,
            position: "absolute",
            top: 0,
            width: "100%"
          },
          {
            transform: [{ translateY: fadeAnim }]
          },
          recyclable ? styles.success : styles.failure
        ]}
      >
        <View style={{ flexDirection: "row", padding: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: "900", color: "#fff" }}>
            {recycleText ? recycleText : "Banana"}
          </Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  success: {
    backgroundColor: "#4BB543"
  },
  failure: {
    backgroundColor: "#ff0033"
  }
});
