/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { Button as RebassButton } from "rebass/styled-components";
import styled from "styled-components";

import Theme from "../../styles/theme";

export const Button = styled(RebassButton)`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }

  svg {
    margin-right: ${Theme.space[2]}px;
  }
`;
