import {
    PixelRatio,
    Platform
} from 'react-native';
import * as Utils from '@utils';
const convertFontScale = fontSize => {
    const baseSize = Platform.select({ ios: 375, android: 420 });
    return fontSize * (Utils.SCREEN.WIDTH / baseSize);
};

const widthPercentageToDP = widthPercent => {
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((Utils.SCREEN.WIDTH * elemWidth) / 100);
};

const heightPercentageToDP = heightPercent => {
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((Utils.SCREEN.HEIGHT * elemHeight) / 100);
};

export default {
    widthPercentageToDP,
    heightPercentageToDP,
    convertFontScale,
};