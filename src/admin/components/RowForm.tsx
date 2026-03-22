import type { FC } from 'hono/jsx';
import type { ColumnInfo } from '../db';

interface RowFormProps {
  columns: ColumnInfo[];
  pkColumns: string[];
  values?: Record<string, unknown>;
  action: string;
  submitLabel: string;
}

function inputType(col: ColumnInfo): string {
  const t = col.type.toUpperCase();
  if (t.includes('INT') || t.includes('REAL') || t.includes('FLOAT') || t.includes('DOUBLE') || t.includes('NUMERIC')) {
    return 'number';
  }
  return 'text';
}

function isLongText(value: unknown): boolean {
  return typeof value === 'string' && value.length > 100;
}

export const RowForm: FC<RowFormProps> = ({ columns, pkColumns, values, action, submitLabel }) => {
  const isEdit = !!values;

  return (
    <form method="post" action={action} class="admin-form">
      {columns.map((col) => {
        const val = values?.[col.name];
        const strVal = val === null || val === undefined ? '' : String(val);
        const isPk = pkColumns.includes(col.name);
        const readOnly = isPk && isEdit;
        const type = inputType(col);
        const useTextarea = isLongText(val) || col.type.toUpperCase() === 'TEXT';

        return (
          <div class="admin-field">
            <label for={`f-${col.name}`}>
              {col.name}
              {col.notnull ? ' *' : ''}
            </label>
            {useTextarea && !readOnly ? (
              <textarea id={`f-${col.name}`} name={col.name} required={!!col.notnull && !isPk}>{strVal}</textarea>
            ) : (
              <input
                id={`f-${col.name}`}
                name={readOnly ? undefined : col.name}
                type={type}
                value={strVal}
                disabled={readOnly}
                required={!!col.notnull && !isPk && !isEdit}
                placeholder={col.dflt_value ? `default: ${col.dflt_value}` : ''}
                step={type === 'number' ? 'any' : undefined}
              />
            )}
            <span class="field-hint">
              {col.type || 'TEXT'}
              {isPk ? ' · primary key' : ''}
              {col.dflt_value ? ` · default: ${col.dflt_value}` : ''}
            </span>
          </div>
        );
      })}
      <div class="admin-actions">
        <button type="submit" class="admin-btn admin-btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
};
