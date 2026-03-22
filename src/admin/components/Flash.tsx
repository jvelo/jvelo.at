import type { FC } from 'hono/jsx';

export const Flash: FC<{ type?: string; message?: string }> = ({ type, message }) => {
  if (!message) return null;
  const isError = type === 'error';
  const cls = isError ? 'admin-flash admin-flash-error' : 'admin-flash admin-flash-success';
  const prefix = isError ? '✗ ' : '→ ';
  return <div class={cls} id="admin-flash">{prefix}{message}</div>;
};
