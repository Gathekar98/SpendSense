import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TransactionRow } from '../components/TransactionRow';
import { useTransactions } from '../context/TransactionsContext';
import { Transaction } from '../types/transaction';

export default function TransactionsScreen() {
  const {
    transactions,
    isLoading,
    deleteTransaction,
  } = useTransactions();

  const handleDeleteTransaction = (transaction: Transaction) => {
    Alert.alert(
      'Delete transaction?',
      `${transaction.merchant} — ₹${transaction.amount.toFixed(2)}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(transaction.id);
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Loading transactions…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(transaction) => transaction.id}
      renderItem={({ item }) => (
        <TransactionRow
          transaction={item}
          onLongPress={handleDeleteTransaction}
        />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>All transactions</Text>
          <Text style={styles.description}>
            {transactions.length}{' '}
            {transactions.length === 1
              ? 'transaction'
              : 'transactions'}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.message}>
          No transactions added yet.
        </Text>
      }
      contentContainerStyle={[
        styles.listContent,
        transactions.length === 0 && styles.emptyContent,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#F5F7FA',
  },
  emptyContent: {
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#172033',
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: '#667085',
  },
  message: {
    textAlign: 'center',
    fontSize: 15,
    color: '#667085',
  },
});