import { useState } from 'react'
import useSWR from 'swr'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fetcher } from './lib/fetcher'

interface User {
  id: number
  name: string
  email: string
  username: string
}

function App() {
  const [count, setCount] = useState(0)
  const { data, error, isLoading } = useSWR<User[]>(
    'https://jsonplaceholder.typicode.com/users',
    fetcher
  )

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + SWR</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <div className="card">
        <h2>SWR Demo - User List</h2>
        {isLoading && <p>Loading users...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        {data && (
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            {data.slice(0, 5).map((user) => (
              <li key={user.id}>
                <strong>{user.name}</strong> ({user.username})
                <br />
                <small>{user.email}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
