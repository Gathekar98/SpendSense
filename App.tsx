import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
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
});
