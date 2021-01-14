import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome5";
import EStyleSheet from "react-native-extended-stylesheet";

export default class index extends Component {
  render() {
    const { style, ...rest } = this.props;
    return <Icon style={EStyleSheet.flatten([style && style])} {...rest} />;
  }
}

index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

index.defaultProps = {
  style: {}
};
