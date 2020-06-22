import query from '../queries/page.graphql';
import {NextApolloPage, withApollo} from '../src/apollo/with-apollo';
import {Page as PrismicPage, PageBody, PageBodyContent} from '../src/@types/graphql-schema';
import React from 'react';
import {getQueryFun} from "../src/apollo/utils";
import SiteLayout from "../components/SiteLayout";
import {PageTitle} from "../components/PageTitle/PageTitle";
import {RichText} from "prismic-reactjs";

export type Props = {
    page?: PrismicPage;
};

const PageBodyContentSlice: React.FC<PageBodyContent> = ({primary}) => <RichText render={primary?.text}/>

const slices: { [typeName: string]: React.FC<PageBody> } = {
    "PageBodyContent": PageBodyContentSlice
};

const GenericPage: NextApolloPage<Props> = ({page}) => {
    return (
        <SiteLayout>
            <PageTitle>{RichText.asText(page.title)}</PageTitle>

            { page.subtitle && <RichText render={page.subtitle} /> }

            {
                page.body.map(slice => <>
                    {slices[slice.__typename](slice)}
                </>)
            }
        </SiteLayout>
    );
};

GenericPage.getInitialProps = getQueryFun<Props>(query, ctx => ({
    slug: ctx.query.slug as string
}));

export default withApollo(GenericPage);
