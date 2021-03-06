/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Button } from "./Button";
import { Activity } from "react-feather";

storiesOf("Button", module).add("default", () => {
  return (
    <>
      <Button variant="primary" mr={2}>
        Primary
      </Button>
      <Button variant="secondary" mr={2}>
        Secondary
      </Button>
      <Button variant="outline" mr={2}>
        Outline
      </Button>
    </>
  );
});

storiesOf("Button", module).add("icon button", () => {
  return (
    <>
      <Button variant="primary" mr={2}>
        <Activity />
        Icon button
      </Button>
    </>
  );
});
