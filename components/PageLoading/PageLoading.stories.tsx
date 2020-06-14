import * as React from 'react';
import {storiesOf} from '@storybook/react';
import PageLoading from "./PageLoading";

storiesOf('PageLoading', module).add('default', () => {
    return <PageLoading isRouteChanging={true} loadingKey={'main'} />;
});
