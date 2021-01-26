import React, { memo } from 'react'
import equals from 'react-fast-compare'
import Animated, { interpolate } from 'react-native-reanimated'
import { styles } from './style'
import { DotProps } from '../../types'
import { IconDot } from './IconDot'
// import { holeHeight } from '../constant'
import { StyleProp, ViewStyle } from 'react-native'


const DotComponent = (props: DotProps) => {
    const { selectedIndex, routes, progress, width, dotColor, dotSize, barHeight, holeHeight } = props;
    const translateX = interpolate(selectedIndex, {
        inputRange: routes.map((item: any, index: number) => index),
        outputRange: routes.map((item: any, index: number) =>
            (index * width / routes.length) + (width / routes.length) / 2 - (dotSize / 2))
    })
    const translateY = interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [0, -(barHeight - holeHeight + 5)]
    })
    const opacity = interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [0.2, 1]
    })
    const iconContainerStyle = [
        {
            opacity,
            justifyContent: 'center',
            alignItems: 'center',
        }
    ] as StyleProp<Animated.AnimateStyle<ViewStyle>>;
    const dotStyle = [
        styles.dot,
        {
            width: dotSize,
            backgroundColor: dotColor,
            height: dotSize,
            bottom: 0,
            borderRadius: dotSize / 2,
            transform: [{ translateX: translateX }, { translateY }]
        }
    ] as StyleProp<Animated.AnimateStyle<ViewStyle>>;
    return (
        <Animated.View style={dotStyle}>
            <Animated.View style={iconContainerStyle}>
                {routes.map(({ icon }, index: number) =>
                    <IconDot key={index} index={index} selectedIndex={selectedIndex}>
                        {icon({ progress })}
                    </IconDot>)}
            </Animated.View>
        </Animated.View>
    )
}

const Dot = memo(DotComponent, (prevProps, nextProps) => equals(prevProps, nextProps))
export default Dot

