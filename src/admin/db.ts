import type { D1Database } from '../types';

// -- Validation --

const SAFE_NAME = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const INTERNAL_TABLES = ['_cf_METADATA', 'd1_migrations', 'sqlite_sequence', 'admin_table_config'];

export interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  pkColumns: string[];
}

async function getSchemaNames(db: D1Database): Promise<string[]> {
  const { results } = await db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  ).all();
  return (results as { name: string }[])
    .map((r) => r.name)
    .filter((n) => !INTERNAL_TABLES.includes(n) && !n.startsWith('_cf_') && !n.startsWith('sqlite_'));
}

function assertSafeName(name: string, allowed: string[], kind: string): void {
  if (!SAFE_NAME.test(name)) {
    throw new Error(`Invalid ${kind} name: ${name}`);
  }
  if (!allowed.includes(name)) {
    throw new Error(`Unknown ${kind}: ${name}`);
  }
}

// -- Schema introspection --

export async function listTables(db: D1Database): Promise<{ name: string; count: number }[]> {
  const names = await getSchemaNames(db);
  const tables: { name: string; count: number }[] = [];
  for (const name of names) {
    const row = await db.prepare(`SELECT COUNT(*) as cnt FROM "${name}"`).first();
    tables.push({ name, count: (row?.cnt as number) || 0 });
  }
  return tables;
}

export async function getTableInfo(db: D1Database, table: string): Promise<TableInfo> {
  const names = await getSchemaNames(db);
  assertSafeName(table, names, 'table');

  const { results } = await db.prepare(`PRAGMA table_info("${table}")`).all();
  const columns = results as unknown as ColumnInfo[];
  const pkColumns = columns.filter((c) => c.pk > 0).sort((a, b) => a.pk - b.pk).map((c) => c.name);

  return { name: table, columns, pkColumns };
}

// -- PK encoding for URLs --

export function encodePk(pkColumns: string[], row: Record<string, unknown>): string {
  return pkColumns.map((col) => encodeURIComponent(String(row[col] ?? ''))).join(',');
}

export function decodePk(pkColumns: string[], encoded: string): Record<string, string> {
  const values = encoded.split(',').map(decodeURIComponent);
  const result: Record<string, string> = {};
  pkColumns.forEach((col, i) => {
    result[col] = values[i] || '';
  });
  return result;
}

function pkWhere(pkColumns: string[]): string {
  return pkColumns.map((col) => `"${col}" = ?`).join(' AND ');
}

// -- CRUD --

export async function getRows(
  db: D1Database,
  table: string,
  opts: { page: number; pageSize: number }
): Promise<{ rows: Record<string, unknown>[]; total: number }> {
  const info = await getTableInfo(db, table);
  const offset = (opts.page - 1) * opts.pageSize;

  const countRow = await db.prepare(`SELECT COUNT(*) as cnt FROM "${info.name}"`).first();
  const total = (countRow?.cnt as number) || 0;

  const { results } = await db.prepare(
    `SELECT * FROM "${info.name}" LIMIT ? OFFSET ?`
  ).bind(opts.pageSize, offset).all();

  return { rows: results, total };
}

export async function getRow(
  db: D1Database,
  table: string,
  pkValues: Record<string, string>
): Promise<Record<string, unknown> | null> {
  const info = await getTableInfo(db, table);
  if (info.pkColumns.length === 0) return null;

  const where = pkWhere(info.pkColumns);
  const binds = info.pkColumns.map((col) => pkValues[col]);

  return db.prepare(`SELECT * FROM "${info.name}" WHERE ${where}`).bind(...binds).first();
}

export async function insertRow(
  db: D1Database,
  table: string,
  data: Record<string, string>
): Promise<void> {
  const info = await getTableInfo(db, table);
  const colNames = info.columns.map((c) => c.name);

  const entries = Object.entries(data).filter(([k]) => colNames.includes(k) && data[k] !== '');
  const cols = entries.map(([k]) => `"${k}"`).join(', ');
  const placeholders = entries.map(() => '?').join(', ');
  const values = entries.map(([, v]) => castValue(v, info.columns.find((c) => c.name === entries[0][0])!));

  // Re-cast with correct column lookup
  const castValues = entries.map(([k, v]) => {
    const col = info.columns.find((c) => c.name === k)!;
    return castValue(v, col);
  });

  await db.prepare(`INSERT INTO "${info.name}" (${cols}) VALUES (${placeholders})`).bind(...castValues).run();
}

export async function updateRow(
  db: D1Database,
  table: string,
  pkValues: Record<string, string>,
  data: Record<string, string>
): Promise<void> {
  const info = await getTableInfo(db, table);
  const colNames = info.columns.map((c) => c.name);

  const entries = Object.entries(data).filter(
    ([k]) => colNames.includes(k) && !info.pkColumns.includes(k)
  );
  const setClause = entries.map(([k]) => `"${k}" = ?`).join(', ');
  const setValues = entries.map(([k, v]) => {
    const col = info.columns.find((c) => c.name === k)!;
    return castValue(v, col);
  });
  const whereBinds = info.pkColumns.map((col) => pkValues[col]);

  await db.prepare(
    `UPDATE "${info.name}" SET ${setClause} WHERE ${pkWhere(info.pkColumns)}`
  ).bind(...setValues, ...whereBinds).run();
}

export async function deleteRow(
  db: D1Database,
  table: string,
  pkValues: Record<string, string>
): Promise<void> {
  const info = await getTableInfo(db, table);
  const whereBinds = info.pkColumns.map((col) => pkValues[col]);

  await db.prepare(
    `DELETE FROM "${info.name}" WHERE ${pkWhere(info.pkColumns)}`
  ).bind(...whereBinds).run();
}

// -- Table display config --

export type ColumnDisplay = 'text' | 'image' | 'link' | 'json' | 'datetime' | 'color';

export interface ColumnConfig {
  display?: ColumnDisplay;
  width?: number;
  label?: string;
  hidden?: boolean;
}

export interface TableConfig {
  columns?: Record<string, ColumnConfig>;
}

export async function getTableConfig(db: D1Database, table: string): Promise<TableConfig> {
  const row = await db.prepare(
    'SELECT config FROM admin_table_config WHERE table_name = ?'
  ).bind(table).first();
  if (!row || !row.config) return {};
  try {
    return JSON.parse(row.config as string) as TableConfig;
  } catch {
    return {};
  }
}

export async function setTableConfig(db: D1Database, table: string, config: TableConfig): Promise<void> {
  const json = JSON.stringify(config);
  await db.prepare(
    'INSERT INTO admin_table_config (table_name, config) VALUES (?, ?) ON CONFLICT(table_name) DO UPDATE SET config = ?'
  ).bind(table, json, json).run();
}

export function getColumnConfig(tableConfig: TableConfig, columnName: string): ColumnConfig {
  return tableConfig.columns?.[columnName] || {};
}

// -- Type casting --

function castValue(value: string, col: ColumnInfo): string | number | null {
  if (value === '' && !col.notnull) return null;
  const t = col.type.toUpperCase();
  if (t.includes('INT') || t.includes('REAL') || t.includes('FLOAT') || t.includes('DOUBLE') || t.includes('NUMERIC')) {
    const n = Number(value);
    return isNaN(n) ? value : n;
  }
  return value;
}
