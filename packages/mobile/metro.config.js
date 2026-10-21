// Learn more https://docs.expo.io/guides/customizing-metro
const { withRozenite } = require("@rozenite/metro");
const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);

config = withRozenite(config, {
  enabled: process.env.WITH_ROZENITE === "true",
});
module.exports = withNativeWind(config, { input: "./global.css" });
