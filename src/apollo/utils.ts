/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ApolloPageContext } from "./with-apollo";
import { DocumentNode } from "graphql";

export function getQueryFun<P>(
  query: DocumentNode,
  getVariables?: (ctx: ApolloPageContext) => { [p: string]: unknown }
): (ctx: ApolloPageContext) => P | Promise<P> {
  return async function (ctx: ApolloPageContext) {
    const apollo = ctx.apolloClient;
    const variables = getVariables ? getVariables(ctx) : {};

    try {
      const { data } = await apollo.query({
        query,
        variables,
      });

      return data as P;
    } catch (error) {
      console.error(error);
      return {} as P;
    }
  };
}
