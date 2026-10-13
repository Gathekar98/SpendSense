import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Transaction, TransactionCategory } from "../types/transaction";
import { loadTransactions, saveTransactions } from "../storage/transactionStorage";

type AddTransactionInput = {
    merchant: string;
    amount: number;
    category: TransactionCategory;
};

type TransactionsContextValue = {
    transactions: Transaction[];
    isLoading: boolean;
    addTransaction: (input: AddTransactionInput) => void;
    deleteTransaction:(id:string) => void;
};

type TransactionsProviderProps = {
    children: ReactNode;
};

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

export function TransactionProvider({children,}: TransactionsProviderProps){
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [hasLoadedTransactions, setHasLoadedTransactions] = useState(false);

    useEffect(()=> {
        const restoreTransactions = async () => {
            try{
                const storedTransactions = await loadTransactions();
                setTransactions(storedTransactions);
            }
            catch(error){
                console.error('Unable to load transactions:', error);
            }
            finally{
                setHasLoadedTransactions(true);
            }
        };
        restoreTransactions();
    }, []);

    useEffect(()=>{
        if(!hasLoadedTransactions){return;}

        const persistTransactions = async () => {
            try{
                await saveTransactions(transactions);
            }
            catch(error){
                console.error('Unable to save transactions:' , error);
            }
        };
        persistTransactions();
    }, [transactions, hasLoadedTransactions]);

    const addTransaction = (input: AddTransactionInput) => {
        const newTransactions: Transaction = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            merchant: input.merchant,
            amount: input.amount,
            category: input.category,
            createdAt: new Date().toISOString(),
        };
        setTransactions((currentTransactions) => [
            newTransactions, ...currentTransactions,
        ]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions((currentTransactions) => 
            currentTransactions.filter(
                (transaction) => transaction.id !== id
            )
        );
    };

    return(
        <TransactionsContext.Provider 
            value={{
                transactions,
                isLoading: !hasLoadedTransactions,
                addTransaction,
                deleteTransaction,
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
}


export function useTransactions() {
    const context = useContext(TransactionsContext);

    if(!context){
        throw new Error(
            'useTransactions must be used inside TransactionsProvider'
        );
    }
    return context;
}
