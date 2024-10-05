export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type TwitterLike = {
  id: string;
  created_at: string;
  text?: string;
  truncated?: boolean;
  entities?: Json;
  extended_entities?: Json;
  is_quote_status?: boolean | null;
  quoted_status?: Json;
  quoted_status_id?: number | null;
  source?: string;
  in_reply_to_status_id?: number | null;
  in_reply_to_user_id?: number | null;
  in_reply_to_screen_name?: string | null;
  user?: Json;
  retweet_count?: number | null;
  favorite_count?: number | null;
  favorited?: boolean | null;
  retweeted?: boolean | null;
  possibly_sensitive?: boolean | null;
  lang?: string | null;
};
