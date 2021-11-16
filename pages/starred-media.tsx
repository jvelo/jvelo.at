/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import SiteLayout from "../components/SiteLayout";
import Head from "next/head";
import React from "react";
import { twitter_like } from "@prisma/client";
import { Button } from "../components/Button/Button";
import useSWRInfinite from "swr/infinite";
import { GetServerSideProps } from "next";
import absoluteUrl from "next-absolute-url";
import Masonry from "react-masonry-css";
import Image from "next/image";

type Tweet = Pick<twitter_like, "text" | "created_at" | "extended_entities"> & {
  id: string;
};

type Props = {
  fallback: Data[];
};

type Data = {
  lastIndex: number | undefined;
  likes: Tweet[];
};

const fetcher = (url) => fetch(url).then((res) => res.json());

const FavoriteMediaEntities: React.FC<Props> = ({ fallback }) => {
  const { data, size, setSize } = useSWRInfinite<Data>(
    (index, previousPageData) =>
      `/api/starred-media?before=${previousPageData?.lastIndex || ""}`,
    fetcher,
    { fallbackData: fallback }
  );

  const loadMore = () => setSize(size + 1);
  const likes: Tweet[] = data ? [].concat(...data.map((d) => d.likes)) : [];

  const breakpoints = {
    default: 3,
    800: 2,
    450: 1,
  };

  return (
    <SiteLayout>
      <Head>
        <title>Starred media entities</title>
      </Head>

      <h1>Starred media entities</h1>
      <Masonry
        breakpointCols={breakpoints}
        className="media-grid"
        columnClassName="media-grid-column"
      >
        {likes.map((like) => {
          const media = like.extended_entities["media"][0];
          return (
            <div key={like.created_at?.toString()}>
              <Image
                width={media.sizes.medium.w}
                height={media.sizes.medium.h}
                src={media.media_url_https}
              />
            </div>
          );
        })}
      </Masonry>
      <Button onClick={loadMore}>Load more</Button>

      <style jsx>{`
        :global(.media-grid) {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          margin-left: -20px;
          width: auto;
        }

        :global(.media-grid-column) {
          padding-left: 20px;
          background-clip: padding-box;
        }

        :global(.media-grid-column > div) {
          border: 1px solid black;
          margin-bottom: 20px;
        }
      `}</style>
    </SiteLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { origin } = absoluteUrl(req);
  const likes = await fetch(`${origin}/api/starred-media`).then((r) =>
    r.json()
  );
  return {
    props: {
      fallback: [likes],
    },
  };
};

export default FavoriteMediaEntities;
