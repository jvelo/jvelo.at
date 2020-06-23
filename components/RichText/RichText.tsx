import {RichText as PrismicRichText} from "prismic-reactjs"
import {linkResolver} from "../../src/prismic/links";
import getHtmlSerializer from "../../src/prismic/serializer";
import React from "react";

type RT = React.FC<Pick<PrismicRichText, "render">> & {
    asText(structuredText: any): any;
}

const RichText: RT = ({ render }) => <PrismicRichText
    render={render}
    linkResolver={linkResolver}
    htmlSerializer={getHtmlSerializer()}
/>

RichText.asText = PrismicRichText.asText;

export { RichText };