const escapeCell = (value) => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export function transactionsToCSV(transactions) {
  const header = ['ID', 'Date', 'Type', 'Merchant', 'Category', 'Payment method', 'Status', 'Amount (INR)', 'Notes'];
  const rows = transactions.map((t) => [t.id, t.date, t.type, t.merchant, t.category, t.paymentMethod, t.status, t.amount, t.notes]);
  return [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
}

export function downloadTextFile(filename, text, mime = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
