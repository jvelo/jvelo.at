import {ApolloPageContext} from "./with-apollo";
import {DocumentNode} from "graphql";

export function getQueryFun<P>(
    query: DocumentNode,
    getVariables?: (ctx: ApolloPageContext) => { [p: string]: any }
): (ctx: ApolloPageContext) => P | Promise<P> {
    return async function (ctx: ApolloPageContext) {
        const apollo = ctx.apolloClient;
        const variables = getVariables ? getVariables(ctx) : {};

        try {
            const {data} = await apollo.query({
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
