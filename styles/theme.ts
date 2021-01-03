/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const primaryColor = "black";
const breakpoints = ["576px", "768px", "992px", "1200px"];

export default {
  fonts: {
    sans: "PT Sans, sans-serif",
    serif: "Crimson Text, serif",
    mono: "PT Mono, monospace",
  },
  colors: {
    primary: primaryColor,
    white: "#ffffff",
    gray: "#f0f0f0",
    lighterGray: "#f8f8f8",
    lightGray: "#e8e8e8",
    offWhite: "#f7f7f7",
    darkGray: "#4e4e4e",
  },
  breakpoints,
  mediaQueries: {
    small: `@media screen and (min-width: ${breakpoints[0]})`,
    medium: `@media screen and (min-width: ${breakpoints[1]})`,
    large: `@media screen and (min-width: ${breakpoints[2]})`,
    xl: `@media screen and (min-width: ${breakpoints[3]})`,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  fontSizes: [6, 8, 10, 12, 14, 16, 20, 24, 32, 48, 64],
  fontWeights: {
    normal: 400,
    bold: 700,
  },
  shadows: {
    tiny: "0 1.5px 5px 0 rgba(0, 0, 0, 0.1)",
    small: "0px 0px 5px 0px rgba(0,0,0,0.2)",
    tabs: "0 0 4px 0 rgba(0, 0, 0, 0.1)",
  },
  buttons: {
    primary: {
      color: "white",
      bg: "primary",
    },
    outline: {
      color: "primary",
      bg: "transparent",
      boxShadow: "inset 0 0 0 2px",
    },
  },
  cards: {
    primary: {
      backgroundColor: primaryColor,
      boxShadow: "0 1.5px 5px 0 rgba(0, 0, 0, 0.1)",
    },
  },
};
