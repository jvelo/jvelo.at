import type { FC } from 'hono/jsx';
import type { ColumnInfo, TableConfig, ColumnConfig } from '../db';
import { getColumnConfig } from '../db';

interface DataTableProps {
  columns: ColumnInfo[];
  pkColumns: string[];
  rows: Record<string, unknown>[];
  linkBase: string;
  encodePk: (row: Record<string, unknown>) => string;
  tableConfig?: TableConfig;
  page?: number;
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  return s.length > 80 ? s.slice(0, 80) + '…' : s;
}

const CellContent: FC<{ value: unknown; config: ColumnConfig }> = ({ value, config }) => {
  if (value === null || value === undefined) {
    return <span class="cell-null">null</span>;
  }
  if (value === '') {
    return <span class="cell-empty">(empty)</span>;
  }

  const display = config.display || 'text';
  const str = String(value);

  switch (display) {
    case 'image': {
      const w = config.width || 48;
      return (
        <span class="cell-image">
          <img src={str} alt="" style={`height: ${w}px; width: auto; display: block;`} loading="lazy" />
          <img src={str} alt="" class="cell-image-preview" loading="lazy" />
        </span>
      );
    }
    case 'link':
      return <span class="cell-link" title={str}>{formatCell(str)}</span>;
    case 'color':
      return (
        <span style="display: flex; align-items: center; gap: 0.27rem;">
          <span style={`width: 0.72rem; height: 0.72rem; background: ${str}; display: inline-block; border: 1px solid var(--color-border);`} />
          {str}
        </span>
      );
    case 'json':
      return <span style="opacity: 0.7;">{formatCell(str)}</span>;
    case 'datetime':
      return <span>{str}</span>;
    default:
      return <span>{formatCell(value)}</span>;
  }
};

export const DataTable: FC<DataTableProps> = ({ columns, pkColumns, rows, linkBase, encodePk, tableConfig = {}, page = 1 }) => {
  const visibleColumns = columns.filter((col) => !getColumnConfig(tableConfig, col.name).hidden);
  const hasPk = pkColumns.length > 0;

  if (rows.length === 0) {
    return <p style="opacity: 0.4;">empty table</p>;
  }

  return (
    <form method="post" action={`${linkBase}/_bulk-delete`} id="bulk-form">
      <input type="hidden" name="page" value={String(page)} />
      <table>
        <thead>
          <tr>
            {visibleColumns.map((col) => {
              const cc = getColumnConfig(tableConfig, col.name);
              return (
                <th class={pkColumns.includes(col.name) ? 'pk-col' : ''}>
                  {cc.label || col.name}
                  {pkColumns.includes(col.name) && ' ●'}
                </th>
              );
            })}
            {hasPk && <th style="width: 1.8rem; text-align: center;"><input type="checkbox" class="row-select" id="select-all" /></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const pk = encodePk(row);
            return (
              <tr>
                {visibleColumns.map((col) => {
                  const val = row[col.name];
                  const cc = getColumnConfig(tableConfig, col.name);
                  return (
                    <td>
                      <a href={`${linkBase}/${pk}`}>
                        <CellContent value={val} config={cc} />
                      </a>
                    </td>
                  );
                })}
                {hasPk && (
                  <td style="width: 1.8rem; text-align: center;">
                    <input type="checkbox" name="pk" value={pk} class="row-select" />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </form>
  );
};
