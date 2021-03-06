/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import App from "next/app";

import React from "react";
import { Router } from "next/router";
import PageLoading from "../components/PageLoading/PageLoading";
import { ThemeProvider } from "styled-components";
import theme from "../styles/theme";

type AppProps = Record<string, never>;

class SiteApp extends App<AppProps> {
  state = {
    hasNavigated: false,
    isRouteChanging: false,
    loadingKey: "main",
  };

  routeChangeStartHandler(): void {
    this.setState({
      isRouteChanging: true,
    });
  }

  routeChangeEndHandler(): void {
    this.setState({
      isRouteChanging: false,
    });
  }

  componentDidMount(): void {
    Router.events.on(
      "routeChangeStart",
      this.routeChangeStartHandler.bind(this)
    );
    Router.events.on(
      "routeChangeComplete",
      this.routeChangeEndHandler.bind(this)
    );
    Router.events.on("routeChangeError", this.routeChangeEndHandler.bind(this));
  }

  componentWillUnmount(): void {
    Router.events.off(
      "routeChangeStart",
      this.routeChangeStartHandler.bind(this)
    );
    Router.events.off(
      "routeChangeComplete",
      this.routeChangeEndHandler.bind(this)
    );
    Router.events.off(
      "routeChangeError",
      this.routeChangeEndHandler.bind(this)
    );
  }

  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <PageLoading
          isRouteChanging={this.state.isRouteChanging}
          loadingKey={this.state.loadingKey}
        />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

SiteApp.getInitialProps = async ({ ctx, Component }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return {
    pageProps,
  };
};

export default SiteApp;
