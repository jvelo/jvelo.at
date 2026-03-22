import type { FC } from 'hono/jsx';

export const Flash: FC<{ type?: string; message?: string }> = ({ type, message }) => {
  if (!message) return null;
  const cls = type === 'error' ? 'admin-flash admin-flash-error' : 'admin-flash admin-flash-success';
  return <div class={cls}>{message}</div>;
};
