import type { Context } from 'hono';
import { AdminLayout } from '../components/AdminLayout';
import { RowForm } from '../components/RowForm';
import { getTableInfo, insertRow, encodePk } from '../db';
import type { D1Database } from '../../types';

export async function rowCreateRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const table = c.req.param('table');
  const info = await getTableInfo(db, table);

  return c.html(
    <AdminLayout title={`${table} / new`} crumbs={[{ label: 'tables', href: '/admin' }, { label: table, href: `/admin/${table}` }, { label: 'new' }]}>
      <h2 class="admin-section-title">new row</h2>
      <RowForm
        columns={info.columns}
        pkColumns={info.pkColumns}
        action={`/admin/${table}/new`}
        submitLabel="create"
      />
    </AdminLayout>
  );
}

export async function rowInsertRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const table = c.req.param('table');
  const info = await getTableInfo(db, table);

  const body = await c.req.parseBody();
  const data: Record<string, string> = {};
  for (const col of info.columns) {
    if (col.name in body) {
      data[col.name] = body[col.name] as string;
    }
  }

  await insertRow(db, table, data);

  const pk = encodePk(info.pkColumns, data);
  return c.redirect(`/admin/${table}/${pk}?flash=success&msg=${encodeURIComponent('row created')}`);
}
