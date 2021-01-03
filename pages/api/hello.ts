/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { NextApiRequest, NextApiResponse } from "next";

export default (
  req: NextApiRequest,
  res: NextApiResponse
): void | Promise<void> => {
  res.statusCode = 200;
  res.json({ name: "John Doe" });
};
