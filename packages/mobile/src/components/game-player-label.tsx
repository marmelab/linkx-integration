import type { TextProps } from "react-native";

import { Text } from "react-native";

import type { Player } from "@/model/player";

interface GamePlayerLabelProps extends TextProps {
  player?: Player;
  fallbackName: string;
}

export default function GamePlayerLabel({
  player,
  fallbackName,
  ...props
}: GamePlayerLabelProps) {
  return (
    <Text {...props}>
      {player?.displayName ? player.displayName : fallbackName}
    </Text>
  );
}
