/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { icons } from "feather-icons";
import React from "react";

type Props = {
  name: string;
};

export const Icon: React.FC<Props> = ({ name }) => {
  const icon = icons[name];

  if (icon) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: icon.toSvg({ color: "black" }) }}
      />
    );
  }

  return <>🤷‍♀️Icon not found</>;
};
