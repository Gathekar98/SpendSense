import { Pressable, StyleSheet, Text } from 'react-native';

import { Transaction } from '../types/transaction';

type TransactionRowProps = {
  transaction: Transaction;
  onLongPress: (transaction: Transaction) => void;
};

export function TransactionRow({
  transaction,
  onLongPress,
}: TransactionRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onLongPress={() => onLongPress(transaction)}
    >
      <Text style={styles.merchant}>{transaction.merchant}</Text>

      <Text style={styles.amount}>₹{transaction.amount.toFixed(2)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  containerPressed: {
    opacity: 0.6,
  },
  merchant: {
    flex: 1,
    marginRight: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#172033',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D92D20',
  },
});