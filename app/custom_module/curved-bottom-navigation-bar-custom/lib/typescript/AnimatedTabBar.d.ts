/// <reference types="react" />
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabsConfigsType, TabBarAnimationConfigurableProps } from './types';
interface AnimatedTabBarProps extends Pick<BottomTabBarProps, 'state' | 'navigation' | 'descriptors'>, TabBarAnimationConfigurableProps {
    /**
     * Tabs configurations.
     */
    tabs: TabsConfigsType;
    barColor?: string;
    dotSize?: number;
    dotColor?: string;
}
export declare const AnimatedTabBar: (props: AnimatedTabBarProps) => JSX.Element;
export {};
