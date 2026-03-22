import type { Context } from 'hono';
import { AdminLayout } from '../components/AdminLayout';
import { listTables } from '../db';
import type { D1Database } from '../../types';

export async function tablesRoute(c: Context) {
  const db = (c.env as Record<string, unknown>).DB as D1Database;
  const tables = await listTables(db);

  return c.html(
    <AdminLayout title="tables">
      <h2 class="admin-section-title">tables</h2>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>rows</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((t) => (
            <tr>
              <td><a href={`/admin/${t.name}`}>{t.name}</a></td>
              <td class="row-count">{t.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
