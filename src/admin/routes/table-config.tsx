import type { Context } from 'hono';
import type { FC } from 'hono/jsx';
import { AdminLayout } from '../components/AdminLayout';
import { Flash } from '../components/Flash';
import { getTableInfo, getTableConfig, setTableConfig, type ColumnConfig, type ColumnDisplay, type TableConfig } from '../db';
import type { D1Database } from '../../types';

const DISPLAY_OPTIONS: ColumnDisplay[] = ['text', 'image', 'link', 'json', 'datetime', 'color'];

const ConfigForm: FC<{ table: string; columns: { name: string; type: string }[]; config: TableConfig }> = ({ table, columns, config }) => {
  return (
    <form method="post" action={`/admin/${table}/_config`} class="admin-form" style="max-width: 48rem;">
      <table>
        <thead>
          <tr>
            <th>column</th>
            <th>type</th>
            <th>display</th>
            <th>label</th>
            <th>width</th>
            <th>hidden</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col) => {
            const cc: ColumnConfig = config.columns?.[col.name] || {};
            return (
              <tr>
                <td style="font-weight: bold;">{col.name}</td>
                <td style="opacity: 0.4;">{col.type || 'TEXT'}</td>
                <td>
                  <select name={`${col.name}__display`} style="font-family: inherit; font-size: inherit; background: var(--color-bg); color: var(--color-text); border: 1px solid var(--color-border); padding: 0.18rem;">
                    {DISPLAY_OPTIONS.map((opt) => (
                      <option value={opt} selected={cc.display === opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input name={`${col.name}__label`} value={cc.label || ''} placeholder={col.name} style="font-family: inherit; font-size: inherit; width: 6rem; background: var(--color-bg); color: var(--color-text); border: 1px solid var(--color-border); padding: 0.18rem 0.27rem;" />
                </td>
                <td>
                  <input name={`${col.name}__width`} type="number" value={cc.width ? String(cc.width) : ''} placeholder="px" style="font-family: inherit; font-size: inherit; width: 3.6rem; background: var(--color-bg); color: var(--color-text); border: 1px solid var(--color-border); padding: 0.18rem 0.27rem;" />
                </td>
                <td style="text-align: center;">
                  <input name={`${col.name}__hidden`} type="checkbox" checked={!!cc.hidden} value="1" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div class="admin-actions">
        <button type="submit" class="admin-btn">save config</button>
        <a href={`/admin/${table}`} class="admin-btn">cancel</a>
      </div>
    </form>
  );
};

export async function tableConfigRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const table = c.req.param('table');
  const info = await getTableInfo(db, table);
  const config = await getTableConfig(db, table);

  const flash = c.req.query('flash');
  const msg = c.req.query('msg');

  return c.html(
    <AdminLayout title={`${table} config`} crumbs={[{ label: 'tables', href: '/admin' }, { label: table, href: `/admin/${table}` }, { label: 'config' }]}>
      <Flash type={flash} message={msg} />
      <h2 class="admin-section-title">{table} — display config</h2>
      <ConfigForm
        table={table}
        columns={info.columns.map((c) => ({ name: c.name, type: c.type }))}
        config={config}
      />
    </AdminLayout>
  );
}

export async function tableConfigUpdateRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const table = c.req.param('table');
  const info = await getTableInfo(db, table);

  const body = await c.req.parseBody();
  const config: TableConfig = { columns: {} };

  for (const col of info.columns) {
    const display = (body[`${col.name}__display`] as string) || 'text';
    const label = (body[`${col.name}__label`] as string) || '';
    const widthStr = (body[`${col.name}__width`] as string) || '';
    const hidden = !!(body[`${col.name}__hidden`]);

    const cc: ColumnConfig = {};
    if (display !== 'text') cc.display = display as ColumnDisplay;
    if (label) cc.label = label;
    if (widthStr) cc.width = parseInt(widthStr, 10);
    if (hidden) cc.hidden = true;

    if (Object.keys(cc).length > 0) {
      config.columns![col.name] = cc;
    }
  }

  // Clean empty columns object
  if (Object.keys(config.columns!).length === 0) {
    delete config.columns;
  }

  await setTableConfig(db, table, config);
  return c.redirect(`/admin/${table}?flash=success&msg=${encodeURIComponent('config saved')}`);
}
