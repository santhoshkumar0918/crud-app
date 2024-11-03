// 'use client'

// import { Keypair, PublicKey } from '@solana/web3.js'
// import { useMemo, useState } from 'react'
// import { ellipsify } from '../ui/ui-layout'
// import { ExplorerLink } from '../cluster/cluster-ui'
// import { useCrudappProgram, useCrudappProgramAccount } from './crudapp-data-access'
// import { useWallet } from '@solana/wallet-adapter-react'
// import { create } from 'domain'



// export function CrudappCreate() {
//   const { createEntry } = useCrudappProgram();
//   const {publicKey} = useWallet();
//   const [title,setTitle] = useState('');
//   const [message,setMessage] = useState('');
 
//   const isFormValid  = title.trim() !== '' && message.trim() !== ''


//   const handleSubmit = () => {
//     if (publicKey && isFormValid) {
//        createEntry.mutateAsync({title,message,owner : publicKey}) 
//     }
//   }

//   if(!publicKey){
//     return <p>Connect your Wallet</p>
//   }


//   return (
//    <>
//     <input
//     type='text'
//     value={title}
//     placeholder='Title'
//     onChange={(e) => setTitle(e.target.value)}
//     className='input input-bordered w-full max-w-xs'
//     />
//     <textarea
//     placeholder='Message'
//     value={message}
//     onChange={(e) => setMessage(e.target.value)}
//     className='textarea textarea-bordered w-full max-w-xs'
//     />
//     <button
//     onClick={handleSubmit}
//     disabled={createEntry.isPending && !isFormValid}
//     className='btn btn-xs lg:btn-md btn-primary'
//     />
//    </>
//   )
// }

// export function CrudappList() {
//   const { accounts, getProgramAccount } = useCrudappProgram()

//   if (getProgramAccount.isLoading) {
//     return <span className="loading loading-spinner loading-lg"></span>
//   }
//   if (!getProgramAccount.data?.value) {
//     return (
//       <div className="alert alert-info flex justify-center">
//         <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
//       </div>
//     )
//   }
//   return (
//     <div className={'space-y-6'}>
//       {accounts.isLoading ? (
//         <span className="loading loading-spinner loading-lg"></span>
//       ) : accounts.data?.length ? (
//         <div className="grid md:grid-cols-2 gap-4">
//           {accounts.data?.map((account) => (
//             <CrudappCard key={account.publicKey.toString()} account={account.publicKey} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center">
//           <h2 className={'text-2xl'}>No accounts</h2>
//           No accounts found. Create one above to get started.
//         </div>
//       )}
//     </div>
//   )
// }

// function CrudappCard({ account }: { account: PublicKey }) {
//   const { accountQuery,updateEntry,deleteEntry} = useCrudappProgramAccount({
//     account,
//   })
//    const [message,setMessage] =  useState("")
//    const {publicKey} = useWallet()
//    const title = accountQuery.data?.title;

//    const isFormValid  = message.trim() !== ''

//    const handleSubmit = () => {
//     if (publicKey && isFormValid && title)  {
//        updateEntry.mutateAsync({title,message,owner : publicKey}) 
//     }
//   }

//   if(!publicKey){
//     return <p>Connect your Wallet</p>
//   }


 
//   return accountQuery.isLoading ? (
//     <span className="loading loading-spinner loading-lg"></span>
//   ) : (
//     <div className="card card-bordered border-base-300 border-4 text-neutral-content">
//       <div className="card-body items-center text-center">
//         <div className="space-y-6">
//           <h2 className="card-title justify-center text-3xl cursor-pointer" onClick={() => accountQuery.refetch()}>
//             {accountQuery.data?.title}
//           </h2>
//           <p>{accountQuery.data?.message}</p>
          
//           <div className="card-actions justify-around">
//           <textarea
//     placeholder='Message'
//     value={message}
//     onChange={(e) => setMessage(e.target.value)}
//     className='textarea textarea-bordered w-full max-w-xs'
//     />
//             <button
//               className="btn btn-xs lg:btn-md btn-outline"
//               onClick={handleSubmit}
//               disabled={!isFormValid || updateEntry.isPending}            
//             >
//               Update Journal Entry
//             </button>


//             <button
//               className="btn btn-xs lg:btn-md btn-outline"
//               onClick={() => {
//                 const title = accountQuery.data?.title
//                 if (title) {
//                   return deleteEntry.mutateAsync(title)
//                 }
//               }}
//               disabled={deleteEntry.isPending}
//             >
//               Delete
//             </button>
          
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useCrudappProgram, useCrudappProgramAccount } from './crudapp-data-access'
import { useWallet } from '@solana/wallet-adapter-react'
import { Loader2 } from 'lucide-react'

// CrudappCreate Component
export function CrudappCreate() {
  const { createEntry } = useCrudappProgram()
  const { publicKey } = useWallet()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const isFormValid = title.trim() !== '' && message.trim() !== ''

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey })
      setTitle('')
      setMessage('')
    }
  }

  if (!publicKey) {
    return (
      <div className="rounded-2xl bg-red-500/10 p-6 border border-red-500/20">
        <p className="text-center text-red-500 font-medium">Please connect your wallet to continue.</p>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700/50">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-transparent bg-clip-text">
        Create Journal Entry
      </h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-400 ml-1">Title</label>
          <input
            type="text"
            value={title}
            placeholder="Enter your title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400 ml-1">Message</label>
          <textarea
            rows={4}
            placeholder="Write your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || createEntry.isPending}
          className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 ${
            isFormValid
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-yellow-500/20'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {createEntry.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Entry...
            </span>
          ) : (
            'Create Journal Entry'
          )}
        </button>
      </div>
    </div>
  )
}

// CrudappCard Component
function CrudappCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCrudappProgramAccount({ account })
  const { publicKey } = useWallet()
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const title = accountQuery.data?.title || ''
  
  const isFormValid = message.trim() !== ''

  const handleUpdate = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message, owner: publicKey })
      setMessage('')
      setIsEditing(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="rounded-2xl bg-red-500/10 p-6 border border-red-500/20">
        <p className="text-center text-red-500 font-medium">Please connect your wallet.</p>
      </div>
    )
  }

  if (accountQuery.isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
      <h3 className="text-xl font-semibold text-white mb-3">{accountQuery.data?.title}</h3>
      <p className="text-gray-300 mb-4">{accountQuery.data?.message}</p>
      
      {isEditing ? (
        <div className="space-y-4">
          <textarea
            rows={3}
            placeholder="Update message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
          />
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={!isFormValid || updateEntry.isPending}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                isFormValid
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {updateEntry.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="py-3 px-4 rounded-xl font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
          >
            Edit Entry
          </button>
          <button
            onClick={() => deleteEntry.mutateAsync(title)}
            disabled={deleteEntry.isPending}
            className="py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200"
          >
            {deleteEntry.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// CrudappList Component
export function CrudappList() {
  const { accounts, getProgramAccount } = useCrudappProgram()

  if (getProgramAccount.isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    )
  }

  if (!getProgramAccount.data?.value) {
    return (
      <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-center text-blue-400">
          Program account not found. Please deploy the program and connect to the correct cluster.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-200 to-gray-400 text-transparent bg-clip-text">
        Journal Entries
      </h2>
      {accounts.isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : accounts.data?.length ? (
        <div className="grid gap-6">
          {accounts.data?.map((account) => (
            <CrudappCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 rounded-2xl bg-gray-800/50 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Entries Yet</h3>
          <p className="text-gray-500">Create your first journal entry to get started.</p>
        </div>
      )}
    </div>
  )
}

// Main CrudappFeature Component
export function CrudappFeature() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <CrudappCreate />
        </div>
        <div>
          <CrudappList />
        </div>
      </div>
    </div>
  )
}