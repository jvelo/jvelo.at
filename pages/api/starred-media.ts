/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { NextApiRequest, NextApiResponse } from "next";
import sql from "../../src/db";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const before = req.query.before || "z";
  const likes = await sql`select *
            from web.twitter_like
            where jsonb_array_length(extended_entities->'media') > 0
              and not (extended_entities->'media'->0 ? 'video_info')
              and id < ${before}
            order by id desc
            limit 25;`;
  res.status(200).json({
    likes,
    lastIndex: likes.reduce(
      (memo, like) => (memo < like.id ? memo : like.id),
      "z"
    ),
  });
};
