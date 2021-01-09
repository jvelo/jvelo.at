/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Icon } from "./Icon";

storiesOf("Icon", module).add("default", () => {
  return <Icon name="activity"></Icon>;
});

storiesOf("Icon", module).add("unknown icon", () => {
  return <Icon name="icon that does not exist"></Icon>;
});
