import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {Modal} from "./Modal";
import {Button} from "../Button/Button";
import {useState} from "react";

storiesOf('Modal', module).add('default', () => {
    const [modalOpen, setModalOpen] = useState(false);

    return <>
        <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            Hello
        </Modal>
     </>;
});
