/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from "react";
import { storiesOf } from "@storybook/react";
import Hero from "./Hero";

storiesOf("Hero", module).add("default", () => {
  return <Hero>General Purpose Hacker</Hero>;
});

storiesOf("Hero", module).add("other", () => {
  return <Hero>One two three</Hero>;
});
