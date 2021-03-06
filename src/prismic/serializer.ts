/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable  @typescript-eslint/no-explicit-any */

// See https://prismic.io/docs/reactjs/getting-started/prismic-nextjs

import * as React from "react";
import { HTMLSerializer } from "prismic-reactjs";

import Router from "next/router";
import { hrefResolver, linkResolver } from "./links";

const onClickHandler = (href: string, as: string) => {
  // Handler that will do routing imperatively on internal links
  return (e: Event) => {
    e.preventDefault();
    Router.push(`${href}`, `${as}`);
  };
};

const propsWithUniqueKey = (props: unknown, key: string) =>
  Object.assign(props || {}, { key });

function serializeLink(element: any, key: string, children: unknown) {
  if (element.data.link_type === "Document") {
    // Only for internal links add the new onClick that will imperatively route to the appropriate page
    return React.createElement(
      "a",
      propsWithUniqueKey(
        {
          onClick: onClickHandler(
            hrefResolver(element.data),
            linkResolver(element.data)
          ),
          href: `${linkResolver(element.data)}`,
        },
        key
      ),
      children
    );
  } else {
    // Default link handling
    const targetAttr = element.data.target
      ? { target: element.data.target }
      : {};
    const relAttr = element.data.target ? { rel: "noopener" } : {};
    return React.createElement(
      "a",
      propsWithUniqueKey(
        Object.assign(
          {
            href: element.data.url || `${linkResolver(element.data)}`,
          },
          targetAttr,
          relAttr
        ),
        key
      ),
      children
    );
  }
}

function serializeImage(element: any, key: string) {
  let internal = false;
  let props: any = {};

  if (element.linkTo && element.linkTo.link_type === "Document") {
    // Exclusively for internal links, build the object that can be used for router push
    internal = true;
    props = Object.assign({
      onClick: onClickHandler(
        hrefResolver(element.linkTo),
        linkResolver(element.linkTo)
      ),
      href: `${linkResolver(element.data)}`,
    });
  }
  // Handle images just like regular HTML Serializer
  const linkUrl = element.linkTo
    ? element.linkTo.url || `${linkResolver(element.linkTo)}`
    : null;
  const linkTarget =
    element.linkTo && element.linkTo.target
      ? { target: element.linkTo.target }
      : {};
  const linkRel = linkTarget.target ? { rel: "noopener" } : {};
  const img = React.createElement("img", {
    src: element.url,
    alt: element.alt || "",
  });
  return React.createElement(
    "p",
    propsWithUniqueKey(
      { className: [element.label || "", "block-img"].join(" ") },
      key
    ),
    linkUrl
      ? React.createElement(
          "a",
          // if it's an internal link, replace the onClick
          internal
            ? propsWithUniqueKey(props, key)
            : Object.assign({ href: linkUrl }, linkTarget, linkRel),
          img
        )
      : img
  );
}

export const getHtmlSerializer: () => HTMLSerializer<React.ReactNode> = () => {
  return (type, element, content, children, key) => {
    switch (type) {
      case "hyperlink": // Link
        return serializeLink(element, key, children);

      case "image": // Image
        return serializeImage(element, key);

      default:
        return null;
    }
  };
};

export default getHtmlSerializer;
