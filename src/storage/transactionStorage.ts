import AsyncStorage from '@react-native-async-storage/async-storage';

import {isTransactionCategory, Transaction } from '../types/transaction';

const TRANSACTIONS_STORAGE_KEY = '@spendsense/transactions';

export async function loadTransactions(): Promise<Transaction[]> {
  const storedTransactions = await AsyncStorage.getItem(
    TRANSACTIONS_STORAGE_KEY
  );

  if (!storedTransactions) {
    return [];
  }

  const parsedTransactions = JSON.parse(storedTransactions) as Array<
    Partial<Transaction>
    >;

    return parsedTransactions
        .filter(
            (transaction) =>
            typeof transaction.id === 'string' &&
            typeof transaction.merchant === 'string' &&
            typeof transaction.amount === 'number'
        )
        .map((transaction) => ({
            id: transaction.id as string,
            merchant: transaction.merchant as string,
            amount: transaction.amount as number,
            category: isTransactionCategory(transaction.category)
            ? transaction.category
            : 'Other',
            createdAt: transaction.createdAt ?? new Date().toISOString(),
        }));
}

export async function saveTransactions(
  transactions: Transaction[]
): Promise<void> {
  await AsyncStorage.setItem(
    TRANSACTIONS_STORAGE_KEY,
    JSON.stringify(transactions)
  );
}