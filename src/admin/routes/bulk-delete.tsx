import type { Context } from 'hono';
import { getTableInfo, deleteRow, decodePk } from '../db';
import type { D1Database } from '../../types';

export async function bulkDeleteRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const table = c.req.param('table');
  const info = await getTableInfo(db, table);

  const body = await c.req.parseBody({ all: true });
  const pks = Array.isArray(body.pk) ? body.pk as string[] : body.pk ? [body.pk as string] : [];

  let deleted = 0;
  for (const pk of pks) {
    const pkValues = decodePk(info.pkColumns, pk);
    await deleteRow(db, table, pkValues);
    deleted++;
  }

  const page = (body.page as string) || '1';
  return c.redirect(`/admin/${table}?page=${page}&flash=success&msg=${encodeURIComponent(`${deleted} row${deleted === 1 ? '' : 's'} deleted`)}`);
}
