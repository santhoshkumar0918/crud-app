'use client'

import {getCrudappProgram, getCrudappProgramId }from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'
import { title } from 'process'

interface CreateEntryArgs {
  owner : PublicKey;
  title : string;
  message : string;
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

 const createEntry = useMutation<string,Error,CreateEntryArgs>({
    mutationKey: [`journaEntry` , `create`,{cluster}],
    mutationFn: async ({title , message , }) => {
       return program.methods.createJournalEntry(title,message).rpc();
    },
    onSuccess: (signature)=>{
        transactionToast(signature)
        accounts.refetch();
    },                                                  
    onError : (error) => {
      toast.error(`Error creating enter : ${error.message}`);
    },
 })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry
  
  }
}

export function useCrudappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCrudappProgram()

  const updateEntry = useMutation<string,Error,CreateEntryArgs>({
      mutationKey : [`journalEntry` , `update`, {cluster}],
      mutationFn : async ({title ,message }) => {
        return program.methods.updateJounralEntry(title,message).rpc()
      },

      onSuccess: (signature)=>{
        transactionToast(signature)
        accounts.refetch();
    },                                                  
    onError : (error) => {
      toast.error(`Error creating enter : ${error.message}`);
    },
  })

  const deleteEntry = useMutation({
    mutationKey : [`journalEntry`,`delete`,{cluster}],
    mutationFn : async(title : string) => {
      return program.methods.deleteJounralEntry(title).rpc()
    },

    onSuccess: (signature)=>{
      transactionToast(signature)
      accounts.refetch();
  },  
  })

  const accountQuery = useQuery({
    queryKey: ['crudapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  })

 

  return {
    accountQuery,updateEntry,deleteEntry
  }
}
