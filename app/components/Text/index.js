import React, { Component } from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import { Typography, FontWeight } from "@config";
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Index extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      common,
      name,
      thin,
      ultraLight,
      light,
      regular,
      medium,
      semibold,
      bold,
      heavy,
      black,
      //custom color
      primaryColor,
      //custom
      style
    } = this.props;
    return (
      <Text
        style={EStyleSheet.flatten([
          //default size
          common && Typography.common,
          name && Typography.name,
          thin && EStyleSheet.flatten({ fontWeight: FontWeight.thin }),
          ultraLight && EStyleSheet.flatten({ fontWeight: FontWeight.ultraLight }),
          light && EStyleSheet.flatten({ fontWeight: FontWeight.light }),
          regular && EStyleSheet.flatten({ fontWeight: FontWeight.regular }),
          medium && EStyleSheet.flatten({ fontWeight: FontWeight.medium }),
          semibold && EStyleSheet.flatten({ fontWeight: FontWeight.semibold }),
          bold && EStyleSheet.flatten({ fontWeight: FontWeight.bold }),
          heavy && EStyleSheet.flatten({ fontWeight: FontWeight.heavy }),
          black && EStyleSheet.flatten({ fontWeight: FontWeight.black }),
          // default color
          EStyleSheet.flatten({  color: EStyleSheet.value('$textColor')}),
          //custom for color
          primaryColor && EStyleSheet.flatten({ color: EStyleSheet.value('$primaryColor') }),
          style && style
        ])}
      >
        {this.props.children}
      </Text>
    );
  }
}

// Define typechecking
Index.propTypes = {
  //define style
  name: PropTypes.bool,
  common: PropTypes.bool,
 
  //define font custom
  thin: PropTypes.bool,
  ultraLight: PropTypes.bool,
  light: PropTypes.bool,
  regular: PropTypes.bool,
  medium: PropTypes.bool,
  semibold: PropTypes.bool,
  bold: PropTypes.bool,
  heavy: PropTypes.bool,
  black: PropTypes.bool,
  //custon for text color
  primaryColor: PropTypes.bool,
  //custom style
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node // plain text
};

Index.defaultProps = {
  //props for style
  name: false,
  common: false,
 
  //props for font
  thin: false,
  ultraLight: false,
  light: false,
  regular: false,
  medium: false,
  semibold: false,
  bold: false,
  heavy: false,
  black: false,
  //custon for text color
  primaryColor: false,
  //numberOfLines
  numberOfLines: 10,
  //custom style
  style: {},
  children: ""
};
