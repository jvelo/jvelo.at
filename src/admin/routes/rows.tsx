import type { Context } from 'hono';
import { AdminLayout } from '../components/AdminLayout';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { Flash } from '../components/Flash';
import { getTableInfo, getRows, getTableConfig, encodePk } from '../db';
import type { D1Database } from '../../types';

export async function rowsRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const table = c.req.param('table');
  const page = parseInt(c.req.query('page') || '1', 10) || 1;
  const pageSize = 50;

  const info = await getTableInfo(db, table);
  const { rows, total } = await getRows(db, table, { page, pageSize });
  const tableConfig = await getTableConfig(db, table);

  const flash = c.req.query('flash');
  const msg = c.req.query('msg');

  return c.html(
    <AdminLayout title={table} crumbs={[{ label: 'tables', href: '/admin' }, { label: table }]}>
      <Flash type={flash} message={msg} />
      <div class="admin-toolbar">
        <h2 class="admin-section-title">{table} <span class="row-count">({total})</span></h2>
        <div class="admin-actions">
          <a href={`/admin/${table}/_config`} class="admin-btn">config</a>
          {info.pkColumns.length > 0 && (
            <a href={`/admin/${table}/new`} class="admin-btn">+ new row</a>
          )}
        </div>
      </div>
      <DataTable
        columns={info.columns}
        pkColumns={info.pkColumns}
        rows={rows}
        linkBase={`/admin/${table}`}
        encodePk={(row) => encodePk(info.pkColumns, row)}
        tableConfig={tableConfig}
        page={page}
      />
      <Pagination page={page} pageSize={pageSize} total={total} baseUrl={`/admin/${table}`} />
    </AdminLayout>
  );
}
