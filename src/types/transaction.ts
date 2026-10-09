export const TRANSACTION_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Other',
] as const;

export type TransactionCategory =
  (typeof TRANSACTION_CATEGORIES)[number];

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  category: TransactionCategory;
  createdAt: string;
};

export function isTransactionCategory(
  value: unknown
): value is TransactionCategory {
  return (
    typeof value === 'string' &&
    TRANSACTION_CATEGORIES.includes(value as TransactionCategory)
  );
}