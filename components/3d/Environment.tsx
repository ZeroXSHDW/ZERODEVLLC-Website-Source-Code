"use client";

import { memo } from "react";
import { Environment as DreiEnvironment } from "@react-three/drei";

interface EnvironmentProps {
  enabled?: boolean;
  preset?:
    | "sunset"
    | "dawn"
    | "night"
    | "warehouse"
    | "forest"
    | "apartment"
    | "studio"
    | "city"
    | "park"
    | "lobby";
  background?: boolean;
}

export const Environment = memo(function Environment({
  enabled = true,
  preset = "studio",
  background = false,
}: EnvironmentProps = {}) {
  if (!enabled) return null;

  return <DreiEnvironment preset={preset} background={background} />;
});
