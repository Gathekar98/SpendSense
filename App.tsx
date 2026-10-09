import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, TextInput, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>SpendSense</Text>
          <Text style={styles.subtitle}>Track where your money goes</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today's Spending</Text>
          <Text style={styles.summaryAmount}>₹0</Text>
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
          onPress={() => 
            Alert.alert(
              'Transaction preview',
              merchant && amount
              ? `Merchant: ${merchant}\nAmount: ₹${amount}`
              : `Enter a merchant and an amount.`,
            )
          }
          style={({pressed}) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </Pressable>
          <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3',
    paddingHorizontal: 24,
    paddingTop: 24,
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
  }
});
