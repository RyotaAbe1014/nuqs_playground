import { useState } from 'react'
import useSWR from 'swr'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fetcher } from './lib/fetcher'
import { qiitaFetcher, qiitaEndpoints } from './lib/qiita-client'

interface User {
  id: number
  name: string
  email: string
  username: string
}

interface QiitaUser {
  id: string
  name: string
  description: string
  followers_count: number
  items_count: number
  profile_image_url: string
}

interface QiitaItem {
  id: string
  title: string
  url: string
  likes_count: number
  created_at: string
}

function App() {
  const [count, setCount] = useState(0)

  // JSONPlaceholder API demo
  const { data, error, isLoading } = useSWR<User[]>(
    'https://jsonplaceholder.typicode.com/users',
    fetcher
  )

  // Qiita API demo
  const {
    data: qiitaUser,
    error: qiitaError,
    isLoading: qiitaLoading
  } = useSWR<QiitaUser>(
    qiitaEndpoints.authenticatedUser,
    qiitaFetcher
  )

  const {
    data: qiitaItems,
    error: qiitaItemsError,
    isLoading: qiitaItemsLoading
  } = useSWR<QiitaItem[]>(
    qiitaUser ? qiitaEndpoints.userItems(qiitaUser.id) : null,
    qiitaFetcher
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
        <h2>JSONPlaceholder API - User List</h2>
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

      <div className="card">
        <h2>Qiita API - Authenticated User</h2>
        {qiitaLoading && <p>Loading Qiita user...</p>}
        {qiitaError && <p style={{ color: 'red' }}>Error: {qiitaError.message}</p>}
        {qiitaUser && (
          <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <img
              src={qiitaUser.profile_image_url}
              alt={qiitaUser.name}
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
            <p>
              <strong>{qiitaUser.name}</strong> (@{qiitaUser.id})
            </p>
            <p>{qiitaUser.description}</p>
            <p>
              Followers: {qiitaUser.followers_count} | Items: {qiitaUser.items_count}
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Qiita API - My Items</h2>
        {qiitaItemsLoading && <p>Loading items...</p>}
        {qiitaItemsError && <p style={{ color: 'red' }}>Error: {qiitaItemsError.message}</p>}
        {qiitaItems && (
          <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            {qiitaItems.slice(0, 5).map((item) => (
              <li key={item.id}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <strong>{item.title}</strong>
                </a>
                <br />
                <small>
                  Likes: {item.likes_count} | Created: {new Date(item.created_at).toLocaleDateString()}
                </small>
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
