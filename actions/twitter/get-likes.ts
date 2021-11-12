/* important or not important legaleses */

import mysql, { ResultSetHeader } from "mysql2";
import fetch from "node-fetch";
import { Status } from "twitter-d";

type Tweet = Status & {
  // Odd, they (twitter-d) have `full_text` when we witness just `text` in the wild ...
  text: string;
};

const {
  TWITTER_USERNAME,
  TWITTER_BEARER_TOKEN,
  DB_HOST,
  DB_USER,
  DB_DATABASE,
  DB_PASSWORD,
} = process.env;

// We're poking this door
const API = `https://api.twitter.com/1.1/favorites/list.json?screen_name=${TWITTER_USERNAME}`;

// We'll throw it all in this sink ouf ours
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
          tweet.id,
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

async function main() {
  const headers = {
    Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
  };

  const data: Tweet[] = await fetch(API, { headers }).then((response) =>
    response.json()
  );

  const insertedRows = await saveTweets(data).catch((error) => {
    console.error("Failed to add tweets to db 🥌 ... 👶");
    console.error(error.message);
    process.exit(-1);
  });

  console.info(`Inserted ${insertedRows} rows 🐶`);
}

main().then(() => client.end());
