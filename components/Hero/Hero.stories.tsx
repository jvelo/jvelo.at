import * as React from 'react';
import {storiesOf} from '@storybook/react';
import Hero from "./Hero";

storiesOf('Hero', module).add('default', () => {
    return <Hero>
        General Purpose Hacker
    </Hero>;
});

storiesOf('Hero', module).add('other', () => {
    return <Hero>
        One two three
    </Hero>;
});