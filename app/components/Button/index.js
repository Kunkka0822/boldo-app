import React, { Component } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import { Text } from "@components";
import styles from "./styles";
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Button extends Component {
  render() {
    const {
      style,
      styleText,
      icon,
      outline,
      full,
      round,
      loading,
      disabled,
      onPress,
      ...rest
    } = this.props;
    return (
      <TouchableOpacity
        {...rest}
        onPress={() => { !disabled && onPress() }}
        style={EStyleSheet.flatten([
          styles.default,
          outline && styles.outline,
          full && styles.full,
          round && styles.round,
          style,
          disabled && { backgroundColor: '$grayColor' }
        ])}
        activeOpacity={0.9}
      >
        {icon ? icon : null}
        <Text
          style={EStyleSheet.flatten([
            styles.textDefault,
            outline && styles.textOuline,
            styleText,
          ])}
          numberOfLines={1}
        >
          {this.props.children || "Button"}
        </Text>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={outline ? EStyleSheet.value('$primaryColor') : EStyleSheet.value('$whiteColor')}
            style={{ paddingLeft: 5 }}
          />
        ) : null}
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.node,
  outline: PropTypes.bool,
  full: PropTypes.bool,
  round: PropTypes.bool,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

Button.defaultProps = {
  style: {},
  icon: null,
  outline: false,
  full: false,
  round: false,
  onPress: () => { },
  disabled: false,
  loading: false
};
