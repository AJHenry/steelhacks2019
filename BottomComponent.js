import React from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    Dimensions,
    StyleSheet
} from "react-native";
import { MapView } from "expo";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import MARKERS from './markers';

const height = 70;

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

    renderSites = () => {
        // sites I showed at the top of this issue come in fine from  props
        const renderedSites = MARKERS.map(site => {
            const { title, description, coordinate, id } = site;
            return (
                <MapView.Marker
                    key={id}
                    title={title}
                    description={description}
                    coordinate={coordinate}
                />
            );
        });

        // if I inspect renderedSites, I see the Marker element, but it doesn't render
        return renderedSites;
    };

    middleView = (width, type) => {
        const fontSize = 20;
        const pV = 5;
        if (type === 'RECYCLE' || type === 'COMPOST' || type === 'GARBAGE') {
            const innerText = type === 'RECYCLE' ? 'This item can be placed in any designated recycling bin. Make sure there are no food or liquid on or in the item.' :
                type === 'COMPOST' ? 'This item can be placed in any designated composting area.' : 'This item cannot be recycled or composted. Please disgard in bin that will go to a landfill.'
            return (
                <View style={{ marginTop:-10, paddingHorizontal: 10, justifyContent:'center'}}>
                    <Text style={{ fontSize: fontSize, color: "#fff", textAlign: 'center' }}>
                        {innerText}
                    </Text>
                </View>

            );
        }

        return (
            <>
                <MapView
                    style={{ flex: 1, width }}
                    initialRegion={{
                        latitude: 40.4406,
                        longitude: -79.9959,
                        latitudeDelta: 0.18,
                        longitudeDelta: 0.0842
                    }}
                >
                    {this.renderSites()}
                </MapView>
                <Text style={{ fontSize: 12, color: "#fff", paddingVertical: 5, paddingBottom: 10 }}>
                    These are specialized recycling centers
            </Text>
            </>
        );
    }

    render() {
        const { fadeAnim, extended } = this.state;
        const {
            isVisible,
            recyclable,
            recycleType,
            compostable,
            special,
            givenHeight
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
                        height: givenHeight + height,
                        position: "absolute",
                        bottom: -givenHeight,
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
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            if (extended) {
                                this.setState({ extended: false }, () =>
                                    this._toggleSubview(0)
                                );
                            } else {
                                this.setState({ extended: true }, () =>
                                    this._toggleSubview(-givenHeight)
                                );
                            }
                        }}
                    >
                        <View
                            style={{
                                paddingVertical: 18,
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name={
                                    recyclable
                                        ? "recycle"
                                        : compostable
                                            ? "leaf"
                                            : special
                                                ? "bolt"
                                                : "trash-o"
                                } size={24} style={{ color: 'white', paddingHorizontal: 10 }} ></FontAwesome>
                                <Text style={{ fontSize: 24, fontWeight: "900", color: "#fff" }}>
                                    {recyclable
                                        ? "Recyclable"
                                        : compostable
                                            ? "Compostable"
                                            : special
                                                ? "Special"
                                                : "Non-recyclable"}
                                </Text>
                                <FontAwesome name={
                                    recyclable
                                        ? "recycle"
                                        : compostable
                                            ? "leaf"
                                            : special
                                                ? "bolt"
                                                : "trash-o"
                                } size={24} style={{ color: 'white', paddingHorizontal: 10 }} ></FontAwesome>
                            </View>
                            {!extended ? (
                                <Text style={{ fontSize: 12, color: "#dcdcdc" }}>
                                    Press for more details
                </Text>
                            ) : (
                                    <Text style={{ fontSize: 12, color: "#dcdcdc" }}>
                                        Press to close
                </Text>
                                )}
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            height: givenHeight,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingBottom: 10
                        }}
                    >
                        {this.middleView(width,
                            recyclable
                                ? 'RECYCLE'
                                : compostable
                                    ? 'COMPOST'
                                    : special
                                        ? 'SPECIAL'
                                        : 'GARBAGE')}
                    </View>
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
    },
    special: {
        backgroundColor: "#2E5894"
    },
    compost: {
        backgroundColor: "#DEA681"
    }
});
