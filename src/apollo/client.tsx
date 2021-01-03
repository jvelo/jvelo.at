/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { PrismicLink } from "apollo-link-prismic";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  NormalizedCacheObject,
} from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import result from "../__generated__/introspection-result";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export function getApolloClient(
  initialState = {}
): ApolloClient<NormalizedCacheObject> {
  // Make sure to create a new client for every server-side request so that data isn't shared between connections
  if (typeof window === "undefined") {
    return createApolloClient(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

export function createApolloClient(
  initialState = {}
): ApolloClient<NormalizedCacheObject> {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: result,
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined", // Disables forceFetch on the server (so queries are only run once)

    link: PrismicLink({
      uri: `${process.env.PRISMIC_ENDPOINT}/graphql`,
    }),

    cache: new InMemoryCache({ fragmentMatcher }).restore(initialState),
  });
}
