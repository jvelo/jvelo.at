import { RichText as PrismicRichText, RichTextProps } from "prismic-reactjs";
import { linkResolver } from "../../src/prismic/links";
import getHtmlSerializer from "../../src/prismic/serializer";
import React from "react";

/* eslint-disable  @typescript-eslint/no-explicit-any */

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
