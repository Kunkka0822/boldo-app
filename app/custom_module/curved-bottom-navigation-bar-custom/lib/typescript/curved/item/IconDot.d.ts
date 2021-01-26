import React from 'react';
import Animated from 'react-native-reanimated';
interface IconDotProps {
    index: number;
    selectedIndex: Animated.Node<number>;
    children: React.ReactNode;
}
export declare const IconDot: React.MemoExoticComponent<(props: IconDotProps) => JSX.Element>;
export {};
