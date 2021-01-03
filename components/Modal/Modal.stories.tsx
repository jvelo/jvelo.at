/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";
import { useState } from "react";

storiesOf("Modal", module).add("default", () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Open modal</Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        Hello
      </Modal>
    </>
  );
});
