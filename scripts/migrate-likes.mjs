import postgres from "postgres";
import { readFile } from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  LIKES_EXPORT_FILE,
} = process.env;

const sql = postgres("postgres://jvelo:@localhost:5432/jvelo", {
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
});

const json = JSON.parse(await readFile(LIKES_EXPORT_FILE));

await sql`
    create schema if not exists web;
    drop table if exists web.twitter_like;

    create table web.twitter_like (
      id varchar(20) not null,
      created_at timestamp not null,
      text text,
      truncated boolean default false,
      entities jsonb default null,
      extended_entities jsonb default null,
      is_quote_status boolean default null,
      quoted_status jsonb default null,
      quoted_status_id bigint default null,
      source text,
      in_reply_to_status_id bigint default null,
      in_reply_to_user_id bigint default null,
      in_reply_to_screen_name text,
      "user" jsonb default null,
      retweet_count integer default null,
      favorite_count integer default null,
      favorited boolean default null,
      retweeted boolean default null,
      possibly_sensitive boolean default null,
      lang varchar(10) default null,
      primary key (id)
    );

    create index twitter_like_created_at_index on web.twitter_like (created_at);
    create index twitter_like_lang_index on web.twitter_like (lang);
`.simple();

await sql
  .begin(async (tx) => {
    for (const entry of json) {
      await tx`
        insert into web.twitter_like (
          id,
          created_at,
          text,
          truncated,
          entities,
          extended_entities,
          is_quote_status,
          quoted_status,
          quoted_status_id,
          source,
          in_reply_to_status_id,
          in_reply_to_user_id,
          in_reply_to_screen_name,
          "user",
          retweet_count,
          favorite_count,
          favorited,
          retweeted,
          possibly_sensitive,
          lang
        ) values (
          ${entry.id},
          ${entry.created_at},
          ${entry.text},
          ${entry.truncated},
          ${tx.json(entry.entities)},
          ${tx.json(entry.extended_entities)},
          ${entry.is_quote_status},
          ${tx.json(entry.quoted_status)},
          ${entry.quoted_status_id},
          ${entry.source},
          ${entry.in_reply_to_status_id},
          ${entry.in_reply_to_user_id},
          ${entry.in_reply_to_screen_name},
          ${tx.json(entry.user)},
          ${entry.retweet_count},
          ${entry.favorite_count},
          ${entry.favorited},
          ${entry.retweeted},
          ${entry.possibly_sensitive},
          ${entry.lang}
        )
      `;
    }
  })
  .then(() => console.log("insertion complete"))
  .catch((error) =>
    console.error("Transaction failed, no data was inserted:", error)
  );

await sql.end();
