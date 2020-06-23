import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {PageTitle, Subtitle} from "./PageTitle";

storiesOf('PageTitle', module).add('default', () => {
    return <PageTitle>Page title</PageTitle>;
});

storiesOf('PageTitle', module).add('with subtitle', () => {
    return <PageTitle>
        Page title
        <Subtitle>With a subtitle</Subtitle>
    </PageTitle>;
});
