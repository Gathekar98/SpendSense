import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { TransactionRow } from './src/components/TransactionRow';
import {
  loadTransactions,
  saveTransactions,
} from './src/storage/transactionStorage';
import { Transaction } from './src/types/transaction';

export default function App() {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasLoadedTransactions, setHasLoadedTransactions] = useState(false);

  const totalSpent = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  useEffect(() => {
    const restoreTransactions = async () => {
      try {
        const storedTransactions = await loadTransactions();
        setTransactions(storedTransactions);
      } catch (error) {
        console.error('Unable to load transactions:', error);
      } finally {
        setHasLoadedTransactions(true);
      }
    };

    restoreTransactions();
  }, []);

  useEffect(() => {
    if (!hasLoadedTransactions) {
      return;
    }

    const persistTransactions = async () => {
      try {
        await saveTransactions(transactions);
      } catch (error) {
        console.error('Unable to save transactions:', error);
      }
    };

    persistTransactions();
  }, [transactions, hasLoadedTransactions]);

  const handleAddTransaction = () => {
    const parsedAmount = Number(amount);

    if (!merchant.trim() || !amount.trim()) {
      Alert.alert('Missing information', 'Enter a merchant and amount.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter an amount greater than zero.');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      merchant: merchant.trim(),
      amount: parsedAmount,
    };

    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions,
    ]);

    setMerchant('');
    setAmount('');
  };

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
            setTransactions((currentTransactions) =>
              currentTransactions.filter(
                (currentTransaction) =>
                  currentTransaction.id !== transaction.id
              )
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>SpendSense</Text>
              <Text style={styles.subtitle}>
                Understand where your money goes.
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Today&apos;s spending</Text>
              <Text style={styles.summaryAmount}>
                ₹{totalSpent.toFixed(2)}
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Merchant</Text>

              <TextInput
                style={styles.input}
                value={merchant}
                onChangeText={setMerchant}
                placeholder="Example: Coffee shop"
                placeholderTextColor="#98A2B3"
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Text style={[styles.inputLabel, styles.amountLabel]}>
                Amount
              </Text>

              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Example: 120.50"
                placeholderTextColor="#98A2B3"
                inputMode="decimal"
                returnKeyType="done"
              />

              <Pressable
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.addButtonPressed,
                ]}
                onPress={handleAddTransaction}
              >
                <Text style={styles.addButtonText}>Add transaction</Text>
              </Pressable>
            </View>

            <View style={styles.transactionSection}>
              <Text style={styles.sectionTitle}>Recent transactions</Text>

              <Text style={styles.sectionHint}>
                Long-press a transaction to delete it.
              </Text>

              {transactions.length === 0 ? (
                <Text style={styles.emptyText}>
                  No transactions added yet.
                </Text>
              ) : (
                transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    onLongPress={handleDeleteTransaction}
                  />
                ))
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#172033',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#667085',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#667085',
  },
  summaryAmount: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '700',
    color: '#172033',
  },
  formSection: {
    marginTop: 28,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
  amountLabel: {
    marginTop: 16,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#172033',
  },
  addButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#155EEF',
  },
  addButtonPressed: {
    opacity: 0.7,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  transactionSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
  },
  sectionHint: {
    marginTop: 4,
    marginBottom: 12,
    color: '#667085',
    fontSize: 13,
  },
  emptyText: {
    color: '#667085',
  },
});