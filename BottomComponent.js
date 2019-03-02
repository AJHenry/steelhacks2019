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
      fadeAnim: new Animated.Value(height),
      extended: false
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
    const { fadeAnim, extended } = this.state;
    const {
      isVisible,
      recyclable,
      recycleType,
      compostable,
      special
    } = this.props;
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
            height: 260,
            position: "absolute",
            bottom: -200,
            width: "100%",
            zIndex: 1000
          },
          { transform: [{ translateY: fadeAnim }] },
          recyclable
            ? styles.recyclable
            : compostable
            ? styles.compost
            : special
            ? styles.special
            : styles.nonrecyclable
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (extended) {
              this.setState({ extended: false }, () => this._toggleSubview(0));
            } else {
              this.setState({ extended: true }, () =>
                this._toggleSubview(-200)
              );
            }
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <View style={{ paddingVertical: 18, flexDirection: "column", alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "900", color: "#fff" }}>
                {recyclable
                  ? "Recyclable"
                  : compostable
                  ? "Compostable"
                  : special
                  ? "Special"
                  : "Non-recyclable"}
              </Text>
              {!extended ? <Text style={{ fontSize: 12, color: "#dcdcdc" }}>Press for more details</Text> : null}
            </View>
            <View style={{ height: 200 }}>
              <Text>This is the bottom container</Text>
            </View>
          </View>
        </TouchableOpacity>
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
  },
  special: {
    backgroundColor: "#2E5894"
  },
  compost: {
    backgroundColor: "#DEA681"
  }
});
