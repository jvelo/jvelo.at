/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { NextApiRequest, NextApiResponse } from "next";
import { twitter_like } from "@prisma/client";
import { prisma } from "../../src/prisma/client";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const before = req.query.before || "z";
  const likes = await prisma.$queryRaw<twitter_like[]>`select *
                                                         from twitter_like
                                                         where json_length(extended_entities, '$.media') > 0
                                                           and not json_contains_path(extended_entities, 'one', '$.media[0].video_info')
                                                           and id < ${before}
                                                         order by id desc
                                                         limit 25`;
  res.status(200).json({
    likes,
    lastIndex: likes.reduce(
      (memo, like) => (memo < like.id ? memo : like.id),
      "z"
    ),
  });
};
