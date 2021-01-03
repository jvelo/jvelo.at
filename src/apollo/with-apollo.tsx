/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as React from "react";
import Head from "next/head";
import { ApolloProvider } from "@apollo/react-hooks";
import { getApolloClient } from "./client";
import { NextComponentType, NextPage, NextPageContext } from "next";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";

export interface ApolloProps {
  apolloState?: NormalizedCacheObject;
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export type ApolloPageContext = NextPageContext & {
  apolloClient: ApolloClient<NormalizedCacheObject>;
};

export type NextApolloPage<
  P = Record<string, never>,
  IP = P
> = NextComponentType<ApolloPageContext, IP, P>;

type WithApolloProps = {
  apolloClient: ApolloClient<Record<string, never>>;
  apolloState: unknown;
  [key: string]: unknown;
};

export function withApollo(
  PageComponent: NextApolloPage<any> | NextPage<any>,
  { ssr = true } = {}
): (p: WithApolloProps) => JSX.Element {
  const WithApollo = ({
    apolloClient,
    apolloState,
    ...pageProps
  }: WithApolloProps) => {
    const client = apolloClient || getApolloClient(apolloState);
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in developmentØ
  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";

    if (displayName === "App") {
      console.warn("This withApollo HOC only works with PageComponents.");
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (ctx: ApolloPageContext) => {
      const { AppTree } = ctx;

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const apolloClient = (ctx.apolloClient = getApolloClient());

      // Run wrapped getInitialProps methods
      let pageProps: any = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === "undefined") {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.writableEnded) {
          return pageProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import("@apollo/react-ssr");
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error("Error while running `getDataFromTree`", error);
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
      };
    };
  }

  return WithApollo;
}
