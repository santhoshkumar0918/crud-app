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
import toast from 'react-hot-toast'

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
    return <p className="text-center text-red-500 font-medium">Please connect your wallet to continue.</p>
  }

  return (
    <div className="p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-2xl shadow-lg max-w-md mx-auto text-white space-y-4">
      <h2 className="text-2xl font-bold text-center">Create Journal Entry</h2>
      <input
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 rounded-lg border-0 outline-none bg-gray-700 text-white placeholder-gray-400"
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 rounded-lg border-0 outline-none bg-gray-700 text-white placeholder-gray-400"
      />
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || createEntry.isPending}
        className={`w-full py-2 rounded-lg transition-colors duration-300 ${
          isFormValid ? 'bg-yellow-600 hover:bg-yellow-700 text-white font-semibold' : 'bg-gray-500 text-gray-300 cursor-not-allowed'
        }`}
      >
        {createEntry.isPending ? 'Creating Entry...' : 'Create Journal Entry'}
      </button>
    </div>
  )
}

export function CrudappList() {
  const { accounts, getProgramAccount } = useCrudappProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info text-center">
        <span>Program account not found. Please deploy the program and connect to the correct cluster.</span>
      </div>
    )
  }

  return (
    <div className="space-y-2 py-2 max-w-4xl mx-auto">
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-6">
          {accounts.data?.map((account) => (
            <CrudappCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">
          <h2 className="text-2xl font-semibold">No Accounts Available</h2>
          <p>Create a journal entry above to get started.</p>
        </div>
      )}
    </div>
  )
}

function CrudappCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCrudappProgramAccount({ account })
  const { publicKey } = useWallet()
  const [message, setMessage] = useState('')
  const title = accountQuery.data?.title || ''
  
  const isFormValid = message.trim() !== ''

  const handleUpdate = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message, owner: publicKey })
      setMessage('')
    }
  }

  if (!publicKey) {
    return <p className="text-center text-red-500 font-medium">Please connect your wallet.</p>
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl text-white space-y-4">
      <h3 className="text-xl font-semibold">{accountQuery.data?.title}</h3>
      <p className="text-gray-300">{accountQuery.data?.message}</p>
      <textarea
        placeholder="Update Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
      />
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleUpdate}
          disabled={!isFormValid || updateEntry.isPending}
          className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-300 ${
            isFormValid ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
        >
          {updateEntry.isPending ? 'Updating...' : 'Update Entry'}
        </button>
        <button
          onClick={() => deleteEntry.mutateAsync(title)}
          disabled={deleteEntry.isPending}
          className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-300"
        >
          {deleteEntry.isPending ? 'Deleting...' : 'Delete Entry'}
        </button>
      </div>
    </div>
  )
}
