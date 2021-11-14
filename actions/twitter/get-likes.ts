/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/* 👆 important or not important legaleses */

import mysql, { ResultSetHeader, RowDataPacket } from "mysql2";
import fetch from "node-fetch";
import { Status } from "twitter-d";

type Tweet = Status & {
  // Odd, they (twitter-d) have `full_text` when we witness just `text` in the wild ...
  text: string;
};

// Environment stuffing we'll need later
const {
  TWITTER_USERNAME,
  TWITTER_BEARER_TOKEN,
  DB_HOST,
  DB_USER,
  DB_DATABASE,
  DB_PASSWORD,
} = process.env;

// How many chirps to get at once
const PAGE_SIZE = 200;

// We're poking this door on @jack's website
const API = `https://api.twitter.com/1.1/favorites/list.json?screen_name=${TWITTER_USERNAME}&count=${PAGE_SIZE}`;

// We'll pipe it all in this sink ouf ours
const client = mysql
  .createConnection({
    host: DB_HOST,
    user: DB_USER,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    ssl: {},
  })
  .promise();

// Take the tweets, twists the tweets, feed the tweets, save the tweets 🥁
// Give back how many tweets
const saveTweets: (tweets: Tweet[]) => Promise<number> = (tweets) =>
  client
    .query<ResultSetHeader>(
      `
                insert into twitter_like (id, created_at, text, truncated, entities, extended_entities,
                                          is_quote_status, quoted_status, quoted_status_id, source,
                                          in_reply_to_status_id, in_reply_to_user_id, in_reply_to_screen_name,
                                          user, retweet_count, favorite_count, favorited, retweeted,
                                          possibly_sensitive, lang)
                values
                ?
            `,
      [
        tweets.map((tweet) => [
          tweet.id_str,
          toMySQLDateTime(new Date(tweet.created_at)),
          tweet.text,
          tweet.truncated,
          JSON.stringify(tweet.entities),
          JSON.stringify(tweet.extended_entities),
          tweet.is_quote_status,
          JSON.stringify(tweet.quoted_status),
          tweet.quoted_status_id,
          tweet.source,
          tweet.in_reply_to_status_id,
          tweet.in_reply_to_user_id,
          tweet.in_reply_to_screen_name,
          JSON.stringify(tweet.user),
          tweet.retweet_count,
          tweet.favorite_count,
          tweet.favorited,
          tweet.retweeted,
          tweet.possibly_sensitive,
          tweet.lang,
        ]),
      ]
    )
    .then(([resultSet]) => resultSet.affectedRows);

// Trust [their](https://stackoverflow.com/a/11150727) shorthand trick to convert the other people's dates
// to our MySQL dates, with correct timezone info.
const toMySQLDateTime = (date: Date) =>
  date.toISOString().slice(0, 19).replace("T", " ");

// Gets highest and lowest ids from our database, useful for pagination
const getIdBounds: () => Promise<{
  min: string | undefined;
  max: string | undefined;
}> = () =>
  client
    .query<RowDataPacket[]>(
      "select min(id) as min, max(id) as max from twitter_like"
    )
    .then(([result]) => {
      return {
        min: result[0] && result[0].min,
        max: result[0] && result[0].max,
      };
    });

/**
 * Perform the dance : get someone's favorite tweets against American billionaire technology entrepreneur and
 * philanthropist Jack Dorsey website API, and clone them in our little database.
 *
 * @param tail if we want to get and save older tweets than the ones already in DB. Useful for initial back-filling.
 */
async function main(tail: boolean) {
  const { min, max } = await getIdBounds();

  const endpoint = (() => {
    if (tail && min) {
      return `${API}&max_id=${min}`;
    }
    if (!tail && max) {
      return `${API}&since_id=${max}`;
    }
    return API;
  })();

  const headers = {
    Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
  };

  const data: Tweet[] = await fetch(endpoint, { headers }).then((response) =>
    response.json()
  );

  const tweets = data.filter((tweet) => [min, max].indexOf(tweet.id_str) < 0);

  if (tweets.length === 0) {
    console.info("Nothing to do 🤷");
    return;
  }

  const insertedRows = await saveTweets(tweets).catch((error) => {
    console.error("Failed to add tweets to db 🥌 ... 👶");
    console.error(error.message);
    process.exit(-1);
  });

  console.info(`Inserted ${insertedRows} rows 🐶`);
}

main(process.argv[2] === "--tail").then(() => client.end());
