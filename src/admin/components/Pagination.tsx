import type { FC } from 'hono/jsx';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  baseUrl: string;
}

export const Pagination: FC<PaginationProps> = ({ page, pageSize, total, baseUrl }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const sep = baseUrl.includes('?') ? '&' : '?';
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div class="admin-pager">
      {page > 1 && <a href={`${baseUrl}${sep}page=${page - 1}`}>prev</a>}
      <span class="current">{from}–{to} of {total}</span>
      {page < totalPages && <a href={`${baseUrl}${sep}page=${page + 1}`}>next</a>}
    </div>
  );
};
