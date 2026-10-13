import { Stack } from "expo-router";
import { TransactionProvider } from "../context/TransactionsContext";

export default function RootLayout() {
    return(
        <TransactionProvider>
            <Stack>
                <Stack.Screen  name="index" options={{ headerShown: false }} />
                <Stack.Screen  name="transactions" options={{ title: 'Transactions' }} />
            </Stack>
        </TransactionProvider>
    );
}