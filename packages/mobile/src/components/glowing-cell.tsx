import type { ViewProps } from "react-native";

import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export interface GlowingCellProps extends ViewProps {
  toColor: string;
  fromColor: string;
}

export default function GlowingCell({
  toColor,
  fromColor,
  ...props
}: GlowingCellProps) {
  const backgroundColor = useSharedValue<string>(fromColor);
  const glowStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  useEffect(() => {
    backgroundColor.value = withRepeat(
      withSequence(
        withTiming(fromColor, { duration: 350 }),
        withTiming(toColor, { duration: 350 }),
      ),
      -1,
      true,
    );
  });

  return <Animated.View {...props} style={[props.style, glowStyle]} />;
}
