import query from '../queries/page.graphql';
import {NextApolloPage, withApollo} from '../src/apollo/with-apollo';
import {Page as PrismicPage,} from '../src/@types/graphql-schema';
import React from 'react';
import {getQueryFun} from "../src/apollo/utils";
import SiteLayout from "../components/SiteLayout";
import {PageTitle} from "../components/PageTitle/PageTitle";

export type Props = {
    page?: PrismicPage;
};

const GenericPage: NextApolloPage<Props> = ({page}) => {
    const uid = page._meta?.uid;

    return (
        <SiteLayout>
            <PageTitle>{uid}</PageTitle>
        </SiteLayout>
    );
};

GenericPage.getInitialProps = getQueryFun<Props>(query, ctx => ({
    slug: ctx.query.slug as string
}));

export default withApollo(GenericPage);
