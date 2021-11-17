/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, twitter_like } from "@prisma/client";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const before = req.query.before || "z";
  const prisma = new PrismaClient();
  const likes = await prisma.$queryRaw<twitter_like[]>`select *
                                                         from twitter_like
                                                         where json_length(entities, '$.media') > 0
                                                           and id < ${before}
                                                         order by id desc
                                                         limit 25`;
  prisma.$disconnect();
  res.status(200).json({
    likes,
    lastIndex: likes.reduce(
      (memo, like) => (memo < like.id ? memo : like.id),
      "z"
    ),
  });
};
