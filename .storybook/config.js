import { configure, addDecorator } from '@storybook/react';
// import Modal from 'react-modal';

import GlobalStyle from '../styles/global';
import {ThemeProvider} from "styled-components";
import theme from "../styles/theme";

// Modal.setAppElement(`body`);

const StoryWrapper = storyFn => (
    <ThemeProvider theme={theme}
        style={{
            position: 'fixed',
            top: '0',
            left: '0',
            bottom: '0',
            right: '0',
            display: 'flex',
            overflow: 'auto',
            padding: 25,
            backgroundColor: 'lightgrey',
        }}
    >
        <div style={{ backgroundColor: 'white', margin: 'auto', flex: 1 }}>
            {storyFn()}
        </div>

        <GlobalStyle />
    </ThemeProvider>
);
addDecorator(StoryWrapper);

const req = require.context('../components', true, /.stories.tsx$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
