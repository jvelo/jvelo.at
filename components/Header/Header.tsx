/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import styled from "@emotion/styled";
import React from "react";
import Link from "next/link";
import { Image } from "rebass";
import theme from "../../styles/theme";

const HeaderComponent = styled.header`
  padding: 65px 25px 50px 25px;
  height: 50px;

  ${theme.mediaQueries.small} {
    padding: 65px 50px 50px 50px;
  }

  & a:hover {
    background: none;
  }
`;

export const Header: React.FC = () => (
  <HeaderComponent id={"top"}>
    <Link href={"#navigation"}>
      <a>
        <Image src={"/logo.png"} height={50} />
      </a>
    </Link>
  </HeaderComponent>
);
