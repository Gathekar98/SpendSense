import AsyncStorage from '@react-native-async-storage/async-storage';

import { Transaction } from '../types/transaction';

const TRANSACTIONS_STORAGE_KEY = '@spendsense/transactions';

export async function loadTransactions(): Promise<Transaction[]> {
  const storedTransactions = await AsyncStorage.getItem(
    TRANSACTIONS_STORAGE_KEY
  );

  if (!storedTransactions) {
    return [];
  }

  return JSON.parse(storedTransactions) as Transaction[];
}

export async function saveTransactions(
  transactions: Transaction[]
): Promise<void> {
  await AsyncStorage.setItem(
    TRANSACTIONS_STORAGE_KEY,
    JSON.stringify(transactions)
  );
}