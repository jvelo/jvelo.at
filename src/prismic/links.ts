/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { _Document, _ExternalLink, _Linkable } from "../@types/graphql-schema";

type InternalLink = {
  id: string;
  type: string;
  tags: string[];
  slug: string;
  lang: string;
  uid: string;
  link_type: string;
  isBroken: boolean;
};

/**
 * Link resolver used by Primisc RichText component.
 * The internal representation of the links differ from those of the data model of GraphQL API (see InternalLink above).
 */
export const linkResolver: (link: InternalLink) => string = (link) => {
  switch (link.type) {
    case "page":
      return `/${link.uid}`;
  }

  return "";
};

/**
 * Link resolver: transform prismic internal link to Next.js page URI
 */
export const hrefResolver: (doc: InternalLink) => string = (doc) => {
  switch (doc.type) {
    case "page":
      return `/[slug]`;
  }

  return "/";
};

/**
 * Transform a prismic _Linkable into URI that can be used as href of an actual link.
 * @param link the linkable to get the URI for
 */
export const resolveLink: (link: _Linkable | null | undefined) => string = (
  link
) => {
  // Garbage in, garbage out
  if (link === null || link === undefined) {
    return "#";
  }

  switch (link._linkType) {
    case "Link.document": {
      const meta = (link as _Document)._meta;

      switch (meta.type) {
        default:
          return `/${meta.uid}`;
      }
    }

    case "Link.web":
      return (link as _ExternalLink).url;

    case "Link.image":
    case "Link.file":
      // TODO
      return "#";
  }

  return "#";
};
