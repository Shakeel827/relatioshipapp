import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { theme } from "../theme/theme";

const AView = Animated.createAnimatedComponent(View);

type Props = {
  /**
   * 0..1 "emotional energy" of typing cadence.
   * Pass a SharedValue to avoid rerenders and keep motion ultra-smooth.
   */
  energy?: SharedValue<number>;
};

export function AnimatedSanctuaryBackground({ energy }: Props) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, {
        duration: theme.motion.slow * 4,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [t]);

  const drift = useAnimatedStyle(() => {
    const e = energy?.value ?? 0;
    const e01 = Math.max(0, Math.min(1, e));
    const amp = 22 + 28 * e01;
    const tx = (t.value - 0.5) * amp;
    const ty = (0.5 - t.value) * (amp * 0.85);
    const sc = 1.18 + 0.04 * e01;
    return { transform: [{ translateX: tx }, { translateY: ty }, { scale: sc }] };
  });

  const veil = useAnimatedStyle(() => {
    const e = energy?.value ?? 0;
    const e01 = Math.max(0, Math.min(1, e));
    const a = 0.30 + 0.14 * e01;
    return { opacity: a };
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <AView style={[StyleSheet.absoluteFill, drift]}>
        <LinearGradient
          colors={[
            theme.colors.paper,
            theme.colors.sand,
            theme.colors.blueQuiet,
            theme.colors.lavenderMist,
          ]}
          start={{ x: 0.12, y: 0.06 }}
          end={{ x: 0.92, y: 0.96 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[
            "rgba(143,166,191,0.55)",
            "rgba(201,183,214,0.38)",
            "rgba(244,239,230,0.35)",
          ]}
          start={{ x: 0.85, y: 0.1 }}
          end={{ x: 0.1, y: 0.9 }}
          style={StyleSheet.absoluteFill}
        />
      </AView>

      <AView style={[StyleSheet.absoluteFill, veil]}>
        <LinearGradient
          colors={["rgba(255,255,255,0.00)", theme.colors.mist]}
          start={{ x: 0.5, y: 0.0 }}
          end={{ x: 0.5, y: 1.0 }}
          style={StyleSheet.absoluteFill}
        />
      </AView>
    </View>
  );
}

