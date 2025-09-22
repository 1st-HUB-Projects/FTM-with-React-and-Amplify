import { useEffect, useState } from 'react'
import './App.css'
import { Button, useAuthenticator } from "@aws-amplify/ui-react"
import { client } from './main'
import { fetchAuthSession } from 'aws-amplify/auth'
import type { Tank, TankExtended } from './types/TankType'
import ShowTanks from './components/ShowTanks'
import { fetchTablesApi, addTankApi, deleteTankApi } from './api'


function App() {

  const { signOut } = useAuthenticator()
  const [ greeting, setGreeting] = useState<string | null>('')
  const [ tanks, setTanks] = useState<TankExtended[]>([])
  const [ reload, setReload] = useState<boolean>(true)
  const [ error, setError] = useState<string | null>(null)

  const fetchGreeting = async () => {
    try {
      const currentSession = await fetchAuthSession(); // <--- Corrected call
      const idToken = currentSession.tokens?.idToken?.toString();

      setError(null)
      const { data, errors } = await client.queries.GetGreeting(
        { context: 'your Aquarium'}, // Pass the argument to your Lambda
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

  const fetchTables = async () => {
    try {
      const tanksData = await fetchTablesApi();
      setTanks(tanksData);
      setError(null);
    } catch (err) {
      setError('Error calling REST API');
      console.error('Error calling REST API:', err);
    }
    setReload(false);
  }

  const addTank = async (tank: Tank) => {
    try {
      const tanksData = await addTankApi(tank);
      setTanks(tanksData);
      setError(null);
    } catch (err) {
      setError('Error calling REST API');
      console.error('Error calling REST API:', err);
    }
    setReload(true);
  }

  const deleteTank = async (id: string) => {
    try {
      const tanksData = await deleteTankApi(id);
      setTanks(tanksData);
      setError(null);
    } catch (err) {
      setError('Error calling REST API');
      console.error('Error calling REST API:', err);
    }
    setReload(true);
  }

  useEffect(() => {
    fetchGreeting()
  },[])

  useEffect(() => {
    if (reload) {
      fetchTables()
    }
  },[reload])

  return (
    <div>
      <div className='m-2 flex justify-end'>
        <Button onClick={signOut}>Logout</Button>
      </div>
      <h1 className='text-3xl underline'>Fish Tank Manager</h1>
      <p className='mt-2'>{greeting || '<fetching your details>'}</p>
      <p className='text-red-500'>{error}</p>
      
      <ShowTanks
        tanks={tanks}
        onDelete={deleteTank}
        onAdd={addTank}
      />
    </div>
  )
}

export default App