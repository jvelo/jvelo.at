import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {Button} from "./Button";

storiesOf('Button', module).add('default', () => {
    return <>

        <Button variant='primary' mr={2}>Primary</Button>
        <Button variant='secondary' mr={2}>Secondary</Button>
        <Button variant='outline' mr={2}>Outline</Button>
    </>;
});
