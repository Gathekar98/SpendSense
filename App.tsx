import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, TextInput, Pressable, StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

type Transaction = {
  id:string;
  merchant: string;
  amount: number;
}
const TRANSACTIONS_STORAGE_KEY = '@spendsense/transactions';

export default function App() {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasLoadedTransactions, setHasLoadedTransactions] = useState(false);

  const totalSpent = transactions.reduce((total, transaction) => total + transaction.amount, 0);

  const handleAddTransaction = () => {
    const parsedAmount = Number(amount);

    if(!merchant.trim() || !amount.trim()){
      Alert.alert('Missing information', 'Enter a merchant & amount.');
      return;
    } 
    if(!Number.isFinite(parsedAmount) || parsedAmount <= 0){
      Alert.alert('Invalid amount', 'Enter a valid amount greater than Zero.');
      return;
    }

    const newTransaction : Transaction = {
      id: Date.now().toString(),
      merchant : merchant.trim(),
      amount: parsedAmount,
    };

    setTransactions((currentTransactions)=> [
      newTransaction,
      ...currentTransactions,
    ])

    setMerchant('');
    setAmount('');
  }

  const handleDeleteTransaction = (transaction: Transaction) => {
    Alert.alert(
      'Delete transaction',
      `${transaction.merchant} - ₹${transaction.amount.toFixed(2)}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        } ,
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

  useEffect(()=> {
    const loadTransactions = async () => {
      try{
        const storedTransactions = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
        if(storedTransactions){
          const parsedTransactions : Transaction[] = JSON.parse(storedTransactions);
          setTransactions(parsedTransactions);
        }
      }
      catch(error){
        console.error('Unable to load transactions:', error);
      }
      finally{
        setHasLoadedTransactions(true);
      }
    };

    loadTransactions();
  }, []);

  useEffect(()=> {
    if(!hasLoadedTransactions){
      return;
    }
    const saveTransactions = async () =>{
      try{
        await AsyncStorage.setItem(
          TRANSACTIONS_STORAGE_KEY,
          JSON.stringify(transactions)
        );
      }
      catch(error){
        console.error('Unable to save transactions:', error);
      }
    };
    saveTransactions();
  },[transactions, hasLoadedTransactions]);

  
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
                <Text style={styles.subtitle}>Track where your money goes</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Today's Spending</Text>
                <Text style={styles.summaryAmount}>₹{totalSpent.toFixed(2)}</Text>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Merchant</Text>
                <TextInput
                  value={merchant}
                  onChangeText={setMerchant}
                  placeholder="For example: Swiggy"
                  placeholderTextColor="#98a2b3"
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="done"
                  underlineColorAndroid="transparent"
                  style={styles.input}
                />
                <Text style={[styles.inputLabel, styles.amountLabel]}>Amount</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor="#98a2b3"
                  inputMode="decimal"
                  returnKeyType="done"
                  underlineColorAndroid="transparent"
                  style={styles.input}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={handleAddTransaction}
                style={({pressed}) => [
                  styles.addButton,
                  pressed && styles.addButtonPressed,
                ]}
              >
                <Text style={styles.addButtonText}>Add Transaction</Text>
              </Pressable>

              <View style={styles.transactionSection}>
                <Text style={styles.sectionTitle}>Recent transactions</Text>
                <Text style={styles.sectionHint}>Long-press a transaction to delete it.</Text>
                {transactions.length === 0 ? (
                  <Text style={styles.emptyText}>No transactions added yet.</Text>
                ) : (
                  transactions.map((transaction)=>(
                    <Pressable 
                      key={transaction.id} 
                      style={({pressed}) => [
                        styles.transactionRow,
                        pressed && styles.transactionRowPressed,
                      ]}
                      onLongPress={()=> handleDeleteTransaction(transaction)}
                    >
                      <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
                      <Text style={styles.transactionAmount}>₹{transaction.amount.toFixed(2)}</Text>
                    </Pressable>
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
    backgroundColor: '#f5f7fa',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17202A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#667085',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
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
    color: '#17202A',
  },
  addButton:{
    marginTop: 24,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonPressed: {
    opacity: 0.75,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  formSection: {
    marginTop: 24,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#17202a',
  },
  amountLabel: {
    marginTop: 16,
  },
  transactionSection: {
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
  },
  emptyText: {
    color: '#667085',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  transactionMerchant: {
    flex: 1,
    marginRight: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#172033',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D92D20',
  },
  transactionRowPressed: {
    opacity: 0.6,
  },
  sectionHint:{
    marginBottom: 12,
    color: '#667085',
    fontSize: 13,
  },
});
