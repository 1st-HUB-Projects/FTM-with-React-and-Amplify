import { useEffect, useState } from 'react'
import './App.css'
import { Button, useAuthenticator } from "@aws-amplify/ui-react"
import { client } from './main'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'

function App() {

  const { signOut } = useAuthenticator()
  const [ greeting, setGreeting] = useState<string | null>('')
  const [ error, setError] = useState<string | null>(null)

  const fetchGreeting = async () => {
    try {
      const currentSession = await fetchAuthSession(); // <--- Corrected call
      const idToken = currentSession.tokens?.idToken?.toString();
  
      setError(null)
      const { data, errors } = await client.queries.GetGreeting(
        { context: 'Main Page'}, // Pass the argument to your Lambda
        { authMode: 'userPool',
          headers: {
            Authorization: idToken || '', // 👈 force override
          },
         }
      );
      if (errors) {
        setError(errors[0].message)
      }
      setGreeting(data)
    } catch (err) {
      setError('Error calling Lambda')
      console.error('Error calling Lambda:', err)
    }
  }

  useEffect(() => {
    fetchGreeting()
  },[])

  return (
    <div>
      <div className='m-2 flex justify-end'>
        <Button onClick={signOut}>Logout</Button>
      </div>
      <h1 className='text-3xl underline'>Fish Tank Manager</h1>
      <p>{greeting}</p>
      <p className='text-red-500'>{error}</p>
    </div>
  )
}

export default App
