/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable  @typescript-eslint/no-explicit-any */

import { RichText as PrismicRichText, RichTextProps } from "prismic-reactjs";
import { linkResolver } from "../../src/prismic/links";
import getHtmlSerializer from "../../src/prismic/serializer";
import React from "react";

type RT = React.FC<Pick<RichTextProps, "render">> & {
  asText(structuredText: any): any;
};

const RichText: RT = ({ render }) => (
  <PrismicRichText
    render={render}
    linkResolver={linkResolver}
    htmlSerializer={getHtmlSerializer()}
  />
);

RichText.asText = PrismicRichText.asText;

export { RichText };
