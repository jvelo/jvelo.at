/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import query from "../queries/home.graphql";
import { NextApolloPage, withApollo } from "../src/apollo/with-apollo";
import { Home, HomeBody, HomeBodyText } from "../src/@types/graphql-schema";
import React from "react";
import { getQueryFun } from "../src/apollo/utils";
import SiteLayout from "../components/SiteLayout";
import { RichText } from "../components/RichText/RichText";
import Head from "next/head";
import Hero from "../components/Hero/Hero";

export type Props = {
  home?: Home;
};

const HomeBodyTextSlice: React.FC<HomeBodyText> = ({ primary }) => (
  <RichText render={primary?.text} />
);

const slices: { [typeName: string]: React.FC<HomeBody> } = {
  HomeBodyText: HomeBodyTextSlice,
};

const HomePage: NextApolloPage<Props> = ({ home }) => {
  return (
    <SiteLayout>
      <Head>
        <title>{home.meta_title}</title>
      </Head>

      <RichText render={home?.introduction} />

      <Hero>{home.hero_title}</Hero>

      {home.body.map((slice) => (
        <>{slices[slice.__typename] && slices[slice.__typename](slice)}</>
      ))}
    </SiteLayout>
  );
};

HomePage.getInitialProps = getQueryFun<Props>(query);

export default withApollo(HomePage);
