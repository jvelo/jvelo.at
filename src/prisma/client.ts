/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { PrismaClient } from "@prisma/client";

// Expose the prisma client using a similar construct the prisma team do in their examples
// See https://github.com/prisma/prisma-examples/blob/latest/typescript/rest-nextjs-api-routes/lib/prisma.ts

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
export { prisma };
