import { shiftISO, toISODate } from './dates';

const norm = (v) => String(v ?? '').toLowerCase();

export function dateBoundsFor(filters, today) {
  switch (filters.range) {
    case '7d':
      return [shiftISO(today, -6), today];
    case '30d':
      return [shiftISO(today, -29), today];
    case '90d':
      return [shiftISO(today, -89), today];
    case 'year':
      return [`${today.slice(0, 4)}-01-01`, today];
    case 'custom':
      return [filters.from || '0000-01-01', filters.to || '9999-12-31'];
    default:
      return ['0000-01-01', '9999-12-31'];
  }
}

export function matchesQuery(tx, query) {
  const q = norm(query).trim();
  if (!q) return true;
  return [tx.merchant, tx.category, tx.notes, tx.id].some((field) => norm(field).includes(q));
}

export function filterTransactions(transactions, filters, today = toISODate(new Date())) {
  const [from, to] = dateBoundsFor(filters, today);
  return transactions.filter(
    (t) =>
      matchesQuery(t, filters.q) &&
      (!filters.category || t.category === filters.category) &&
      (!filters.type || t.type === filters.type) &&
      (!filters.method || t.paymentMethod === filters.method) &&
      t.date >= from &&
      t.date <= to,
  );
}

const byNewest = (a, b) =>
  b.date.localeCompare(a.date) || (b.createdAt ?? '').localeCompare(a.createdAt ?? '') || b.id.localeCompare(a.id);

export const sortTransactions = (transactions, sort = 'newest') => {
  const list = [...transactions];
  switch (sort) {
    case 'oldest':
      return list.sort((a, b) => -byNewest(a, b));
    case 'highest':
      return list.sort((a, b) => b.amount - a.amount || byNewest(a, b));
    case 'lowest':
      return list.sort((a, b) => a.amount - b.amount || byNewest(a, b));
    case 'merchant':
      return list.sort((a, b) => a.merchant.localeCompare(b.merchant) || byNewest(a, b));
    default:
      return list.sort(byNewest);
  }
};

export const paginate = (items, page, pageSize) => {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: current, pageCount, total: items.length, start, end: Math.min(start + pageSize, items.length) };
};

export const EMPTY_FILTERS = Object.freeze({ q: '', category: '', type: '', method: '', range: 'all', from: '', to: '', sort: 'newest' });

export const activeFilterCount = (filters) =>
  ['q', 'category', 'type', 'method'].filter((key) => filters[key]).length + (filters.range !== 'all' ? 1 : 0);
