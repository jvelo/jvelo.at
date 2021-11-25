/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import SiteLayout from "../components/SiteLayout";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { twitter_like } from "@prisma/client";
import { Button } from "../components/Button/Button";
import useSWRInfinite from "swr/infinite";
import { GetServerSideProps } from "next";
import absoluteUrl from "next-absolute-url";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { MediaEntity, Size, Status } from "twitter-d";
import { VideoInfo } from "twitter-d/types/video_info";

type Tweet = Pick<twitter_like, "id" | "text" | "created_at"> &
  Pick<Status, "extended_entities">;

type Props = {
  fallback: Data[];
};

type Data = {
  lastIndex: number | undefined;
  likes: Tweet[];
};

const fetcher = (url) => fetch(url).then((res) => res.json());

const Video = (props: { video: VideoInfo; size: Size }) => {
  const ref = useRef<HTMLVideoElement>();
  const [playing, setPlaying] = useState(false);

  const onVideoEnd = () => {
    setTimeout(() => {
      setPlaying(false);
      ref.current.currentTime = 0;
    }, 2000);
  };

  useEffect(() => {
    ref.current.addEventListener("ended", onVideoEnd, false);
    return () => ref.current.removeEventListener("ended", onVideoEnd);
  }, []);

  const play = () => {
    if (ref.current.paused) {
      ref.current.play();
      setPlaying(true);
    } else {
      ref.current.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={`video-player ${playing ? "playing" : ""}`}>
      <div className={"play-button"} onClick={play}>
        ▶
      </div>
      <video ref={ref} width={props.size.w} height={props.size.h}>
        {props.video.variants.map((variant) => (
          <source
            key={variant.url}
            src={variant.url}
            type={variant.content_type}
          />
        ))}
      </video>
      <style jsx>{`
        video {
          width: 100%;
          height: auto;
        }

        .play-button {
          cursor: pointer;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          text-align: center;
          transform: translate(-50%, -50%);
        }

        .playing .play-button {
          display: none;
        }

        .play-button:before {
          position: absolute;
          top: -7px;
          left: -4px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid black;
          content: "";
        }
      `}</style>
    </div>
  );
};

const Media = (props: { media: MediaEntity }) => {
  const isVideo = !!props.media.video_info;
  return (
    <div className={`media ${isVideo ? "video" : ""}`}>
      {!isVideo && (
        <Image
          layout="responsive"
          width={props.media.sizes.medium.w}
          height={props.media.sizes.medium.h}
          src={props.media.media_url_https}
        />
      )}
      {isVideo && (
        <Video video={props.media.video_info} size={props.media.sizes.medium} />
      )}

      <style jsx>{`
        .media {
          position: relative;
        }
      `}</style>
    </div>
  );
};

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

      <h1>✯ media entities</h1>
      <Masonry
        breakpointCols={breakpoints}
        className="media-grid"
        columnClassName="media-grid-column"
      >
        {likes.map((like) => {
          const media = like.extended_entities["media"][0];
          return (
            <div key={like.created_at?.toString()}>
              <Media media={media} />
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
