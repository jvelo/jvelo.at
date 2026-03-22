import type { Context } from 'hono';
import { AdminLayout } from '../components/AdminLayout';
import { RowForm } from '../components/RowForm';
import { Flash } from '../components/Flash';
import { getTableInfo, getRow, updateRow, deleteRow, decodePk, encodePk } from '../db';
import type { D1Database } from '../../types';

export async function rowDetailRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const table = c.req.param('table');
  const pkParam = c.req.param('pk');
  const info = await getTableInfo(db, table);
  const pkValues = decodePk(info.pkColumns, pkParam);
  const row = await getRow(db, table, pkValues);

  if (!row) {
    return c.html(
      <AdminLayout title="not found" crumbs={[{ label: 'tables', href: '/admin' }, { label: table, href: `/admin/${table}` }]}>
        <p>row not found</p>
      </AdminLayout>,
      404
    );
  }

  const flash = c.req.query('flash');
  const msg = c.req.query('msg');

  return c.html(
    <AdminLayout title={`${table} / ${pkParam}`} crumbs={[{ label: 'tables', href: '/admin' }, { label: table, href: `/admin/${table}` }, { label: pkParam }]}>
      <Flash type={flash} message={msg} />
      <h2 class="admin-section-title">edit row</h2>
      <RowForm
        columns={info.columns}
        pkColumns={info.pkColumns}
        values={row}
        action={`/admin/${table}/${pkParam}`}
        submitLabel="save"
      />
      <form method="post" action={`/admin/${table}/${pkParam}/delete`} style="margin-top: 1.8rem;">
        <confirm-button>
          <button type="submit" class="admin-btn admin-btn-danger">delete row</button>
        </confirm-button>
      </form>
    </AdminLayout>
  );
}

export async function rowUpdateRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const table = c.req.param('table');
  const pkParam = c.req.param('pk');
  const info = await getTableInfo(db, table);
  const pkValues = decodePk(info.pkColumns, pkParam);

  const body = await c.req.parseBody();
  const data: Record<string, string> = {};
  for (const col of info.columns) {
    if (col.name in body) {
      data[col.name] = body[col.name] as string;
    }
  }

  await updateRow(db, table, pkValues, data);

  const newPk = encodePk(info.pkColumns, { ...pkValues, ...data });
  return c.redirect(`/admin/${table}/${newPk}?flash=success&msg=${encodeURIComponent('row updated')}`);
}

export async function rowDeleteRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const table = c.req.param('table');
  const pkParam = c.req.param('pk');
  const info = await getTableInfo(db, table);
  const pkValues = decodePk(info.pkColumns, pkParam);

  await deleteRow(db, table, pkValues);
  return c.redirect(`/admin/${table}?flash=success&msg=${encodeURIComponent('row deleted')}`);
}
