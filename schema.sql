create table jvelo_at.twitter_like
(
    id                      varchar(20) primary key,
    created_at              timestamp not null,
    text                    text,
    truncated               bool default FALSE,
    entities                jsonb,
    extended_entities       jsonb,
    is_quote_status         bool,
    quoted_status           json,
    quoted_status_id        bigint,
    source                  text,
    in_reply_to_status_id   bigint,
    in_reply_to_user_id     bigint,
    in_reply_to_screen_name text,
    user_data                    json,
    retweet_count           int,
    favorite_count          int,
    favorited               bool,
    retweeted               bool,
    possibly_sensitive      bool,
    lang                    varchar(10)
);

comment on table jvelo_at.twitter_like is 'likes from my twitter account';

create index twitter_like_created_at_index
    on jvelo_at.twitter_like (created_at);

create index twitter_like_lang_index
    on jvelo_at.twitter_like (lang);

