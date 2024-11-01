'use client'

import { getCrudappProgram, getCrudappProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import { Provider } from 'jotai'

interface CreateEntryArgs {
  owner: PublicKey;
  title: string;
  message: string;
}

export function useCrudappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCrudappProgramId(cluster.network as Cluster), [cluster])
  const program = getCrudappProgram(provider)

  const accounts = useQuery({
    queryKey: ['crudapp', 'all', { cluster }],
    queryFn: () => program.account.journalEntryState.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: [`journalEntry`, `create`, { cluster }],
    mutationFn: async ({ title, message }) => {
      const { blockhash } = await connection.getLatestBlockhash("confirmed")
      const transaction = await program.methods.createJournalEntry(title, message).transaction()

      transaction.recentBlockhash = blockhash
      transaction.feePayer = provider.wallet.publicKey

      const signedTransaction = await provider.wallet.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())
      await connection.confirmTransaction(signature, "confirmed")
      
      return signature
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      accounts.refetch()
    },
    onError: (error) => {
      toast.error(`Error creating entry: ${error.message}`)
    },
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  }
}

export function useCrudappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCrudappProgram()
  const { connection } = useConnection()
  const provider = useAnchorProvider() 

  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: [`journalEntry`, `update`, { cluster }],
    mutationFn: async ({ title, message }) => {
      // Fetch a fresh blockhash
      const latestBlockhash = await connection.getLatestBlockhash("finalized");
  
      const transaction = await program.methods.updateJounralEntry(title, message).transaction();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight; // Ensure this field is included
      transaction.feePayer = provider.wallet.publicKey;
  
      // Sign and send the transaction
      const signedTransaction = await provider.wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  
      // Confirm the transaction
      await connection.confirmTransaction({ signature, ...latestBlockhash }, "finalized");
      
      return signature;
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Error updating entry: ${error.message}`);
    },
  });
  

  const deleteEntry = useMutation<string, Error, string>({
    mutationKey: [`journalEntry`, `delete`, { cluster }],
    mutationFn: async (title) => {
      const { blockhash } = await connection.getLatestBlockhash("confirmed")
      const transaction = await program.methods.deleteJounralEntry(title).transaction()

      transaction.recentBlockhash = blockhash
      transaction.feePayer = provider.wallet.publicKey

      const signedTransaction = await provider.wallet.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())
      await connection.confirmTransaction(signature, "confirmed")

      return signature
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      accounts.refetch()
    },
    onError: (error) => {
      toast.error(`Error deleting entry: ${error.message}`)
    },
  })

  const accountQuery = useQuery({
    queryKey: ['crudapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  })

  return {
    accountQuery,
    updateEntry,
    deleteEntry,
  }
}
