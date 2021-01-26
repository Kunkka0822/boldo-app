import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, TouchableOpacity, Image } from "react-native";
import styles from "./style";
import posed from "react-native-pose";
import * as Animatable from 'react-native-animatable';
import { connect } from "react-redux";
import { Button, Icon } from "@components";
import EStyleSheet from 'react-native-extended-stylesheet';
import * as actionTypes from "@actions/actionTypes";

const onToast = data => {
    return {
        type: actionTypes.PREF_TOAST,
        data
    };
};


const Modal = posed.View({
    enter: {
        y: 0,
        transition: {
            y: {
                ease: "linear",
                duration: 500,
                type: "spring",
                stiffness: 30,
            },
        },
    },
    exit: {
        y: ({ y }) => -1 * y,
        transition: {
            y: {
                ease: "linear",
                duration: 500,
                type: "spring",
                stiffness: 30,
            },
        },
    },
    props: { y: 500 },
});

const Circle = posed.View({
    big: {
        scale: 1.1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 1,
        },
    },
    normal: {
        scale: 1.0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 1,
        },
    },
});

class CustomPushAlert extends Component {
    constructor(props) {
        super(props);
    }

    hideAlert = () => {
        clearTimeout(this._interval);
        this._interval = null;
        this.props.dispatch(onToast(null));
    }

    onPressAlert = () => {
        this.hideAlert();
    }

    render = () => {
        const { toast } = this.props;
        if (toast.toast == null) {
        return null;
        }

        clearTimeout(this._interval);
        this._interval = null;
        this._interval = setTimeout(this.hideAlert, 3000);

        const { text1, text2, type } = toast.toast;
        let bgColor = EStyleSheet.value('$textColor')
        if (type == 'success') bgColor = EStyleSheet.value('$textColor')
        else if (type == 'error') bgColor = EStyleSheet.value('$errorColor')
        else if (type == 'warning') bgColor = EStyleSheet.value('$warningColor')

        return (
            <TouchableWithoutFeedback>
                <Modal style={styles.container} >
                    <Animatable.View animation={"slideInDown"} iterationCount={1} duration={1000} direction="normal">
                        <View style={{ backgroundColor: EStyleSheet.value('$whiteColor') }}>
                            <TouchableOpacity
                                style={[styles.alertBGContainer, { backgroundColor: bgColor }]}
                                activeOpacity={0.8}
                                onPress={this.onPressAlert}
                            >
                                <View style={styles.alertMainContainer}>
                                    <Circle style={[styles.imageStyle, { width: 25 }]} >
                                        <Icon name="bell" size={25} color={EStyleSheet.value("$whiteColor")}></Icon>
                                    </Circle>
                                    <View style={{ flex: 1 }}>
                                        {text1 && text1 != '' && (
                                            <Text style={[styles.alertTitleStyle]}>
                                                {text1}
                                            </Text>
                                        )}
                                        {text2 && text2 != '' && (
                                            <Text style={[styles.alertMessageStyle]} numberOfLines={1}>
                                                {text2}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </Modal>
            </TouchableWithoutFeedback>
        )
    }
}

const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomPushAlert);
