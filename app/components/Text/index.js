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
      //props style
      header,
      title1,
      title2,
      title3,
      headline,
      body1,
      body2,
      callout,
      subhead,
      footnote,
      caption1,
      caption2,
      overline,
      msgdate,
      // props font
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
      textSecondaryColor,
      grayColor,
      dividerColor,
      whiteColor,
      fieldColor,
      blackColor,
      redColor,
      numberOfLines,
      //custom
      style
    } = this.props;
    return (
      <Text
        style={EStyleSheet.flatten([
          header && Typography.header,
          title1 && Typography.title1,
          title2 && Typography.title2,
          title3 && Typography.title3,
          headline && Typography.headline,
          body1 && Typography.body1,
          body2 && Typography.body2,
          callout && Typography.callout,
          subhead && Typography.subhead,
          footnote && Typography.footnote,
          caption1 && Typography.caption1,
          caption2 && Typography.caption2,
          overline && Typography.overline,
          msgdate && Typography.msgdate,
          //custom for font
          thin && EStyleSheet.flatten({ fontWeight: FontWeight.thin }),
          ultraLight &&
          EStyleSheet.flatten({
            fontWeight: FontWeight.ultraLight
          }),
          light && EStyleSheet.flatten({ fontWeight: FontWeight.light }),
          regular && EStyleSheet.flatten({ fontWeight: FontWeight.regular }),
          medium && EStyleSheet.flatten({ fontWeight: FontWeight.medium }),
          semibold && EStyleSheet.flatten({ fontWeight: FontWeight.semibold }),
          bold && EStyleSheet.flatten({ fontWeight: FontWeight.bold }),
          heavy && EStyleSheet.flatten({ fontWeight: FontWeight.heavy }),
          black && EStyleSheet.flatten({ fontWeight: FontWeight.black }),
          // default color
          EStyleSheet.flatten({
            color: EStyleSheet.value('$textPrimaryColor')
          }),
          //custom for color
          primaryColor && EStyleSheet.flatten({ color: EStyleSheet.value('$primaryColor') }),
          textSecondaryColor &&
          EStyleSheet.flatten({
            color: EStyleSheet.value('$textSecondaryColor')
          }),
          grayColor && EStyleSheet.flatten({ color: EStyleSheet.value('$grayColor') }),
          dividerColor && EStyleSheet.flatten({ color: EStyleSheet.value('$dividerColor') }),
          whiteColor && EStyleSheet.flatten({ color: EStyleSheet.value('$whiteColor') }),
          fieldColor && EStyleSheet.flatten({ color: EStyleSheet.value('$fieldColor') }),
          blackColor && EStyleSheet.flatten({ color: EStyleSheet.value('$blackColor') }),
          redColor && EStyleSheet.flatten({ color: EStyleSheet.value('$redColor') }),
          style && style
        ])}
        numberOfLines={numberOfLines}
      >
        {this.props.children}
      </Text>
    );
  }
}

// Define typechecking
Index.propTypes = {
  //define style
  header: PropTypes.bool,
  title1: PropTypes.bool,
  title2: PropTypes.bool,
  title3: PropTypes.bool,
  headline: PropTypes.bool,
  body1: PropTypes.bool,
  body2: PropTypes.bool,
  callout: PropTypes.bool,
  subhead: PropTypes.bool,
  footnote: PropTypes.bool,
  caption1: PropTypes.bool,
  caption2: PropTypes.bool,
  overline: PropTypes.bool,
  msgdate: PropTypes.bool,

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
  textSecondaryColor: PropTypes.bool,
  grayColor: PropTypes.bool,
  dividerColor: PropTypes.bool,
  whiteColor: PropTypes.bool,
  fieldColor: PropTypes.bool,
  //numberOfLines
  numberOfLines: PropTypes.number,
  //custom style
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node // plain text
};

Index.defaultProps = {
  //props for style
  header: false,
  title1: false,
  title2: false,
  title3: false,
  headline: false,
  body1: false,
  body2: false,
  callout: false,
  subhead: false,
  footnote: false,
  caption1: false,
  caption2: false,
  overline: false,
  msgdate: false,
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
  textSecondaryColor: false,
  grayColor: false,
  dividerColor: false,
  whiteColor: false,
  fieldColor: false,
  //numberOfLines
  numberOfLines: 10,
  //custom style
  style: {},
  children: ""
};
