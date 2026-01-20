import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";
import { AnimatedSanctuaryBackground } from "../components/AnimatedSanctuaryBackground";
import { theme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Arrival">;

export function ArrivalScreen({ navigation }: Props) {
  const breath = useSharedValue(0);

  useEffect(() => {
    breath.value = withRepeat(
      withTiming(1, {
        duration: theme.motion.slow * 2,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [breath]);

  useEffect(() => {
    const id = setTimeout(() => navigation.replace("ChatList"), 200);
    return () => clearTimeout(id);
  }, [navigation]);

  const orb = useAnimatedStyle(() => {
    const s = 0.92 + breath.value * 0.14;
    const o = 0.22 + breath.value * 0.18;
    return { transform: [{ scale: s }], opacity: o };
  });

  return (
    <View style={styles.root}>
      <AnimatedSanctuaryBackground />
      <View style={styles.center}>
        <Animated.View style={[styles.orb, orb]} />
        <Text style={styles.text}>Take a moment. Then speak.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.paper },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  orb: {
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(201,183,214,0.55)",
  },
  text: {
    marginTop: theme.spacing.xl,
    textAlign: "center",
    color: theme.colors.ink,
    fontSize: theme.type.title.fontSize,
    lineHeight: theme.type.title.lineHeight,
    letterSpacing: 0.2,
  },
});

