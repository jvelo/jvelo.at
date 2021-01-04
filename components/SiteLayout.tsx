/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import styled, { ThemeProvider } from "styled-components";
import React from "react";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import theme from "../styles/theme";
import Head from "next/head";

const Main = styled.main`
  padding: 25px;
  min-height: calc(100vh - 50px);

  ${theme.mediaQueries.small} {
    padding: 50px;
    min-height: calc(100vh - 100px);
    max-width: 900px;
  }
`;

export const Page: React.FunctionComponent = ({ children }) => (
  <>
    <Head>
      <meta
        key="viewport"
        name="viewport"
        content="initial-scale=1, minimum-scale=1, width=device-width"
      />
    </Head>
    <Header />
    <Main>{children}</Main>
    <Footer />
  </>
);

export default Page;
