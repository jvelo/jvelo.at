/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from "react";
import { storiesOf } from "@storybook/react";
import { PageTitle, Subtitle } from "./PageTitle";

storiesOf("PageTitle", module).add("default", () => {
  return <PageTitle>Page title</PageTitle>;
});

storiesOf("PageTitle", module).add("with subtitle", () => {
  return (
    <PageTitle>
      Page title
      <Subtitle>With a subtitle</Subtitle>
    </PageTitle>
  );
});
