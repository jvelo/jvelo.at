/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import styled from "styled-components";
import React from "react";

const Heading = styled.h1`
  word-spacing: 100vw;
  text-transform: capitalize;
  font-size: 60px;
  line-height: 80px;
  font-weight: bold;
`;

export const Hero: React.FC = ({ children }) => <Heading>{children}</Heading>;

export default Hero;
