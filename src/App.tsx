import useSWR from 'swr'
import './App.css'
import { qiitaFetcher, qiitaEndpoints } from './lib/qiita-client'

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

  // Qiita API demo
  const {
    data: qiitaUser,
    error: qiitaError,
    isLoading: qiitaLoading
  } = useSWR<QiitaUser>(
    qiitaEndpoints.authenticatedUser,
    qiitaFetcher
  )

  // Qiita public items
  const {
    data: publicItems,
    error: publicItemsError,
    isLoading: publicItemsLoading
  } = useSWR<QiitaItem[]>(
    `${qiitaEndpoints.items}?page=1&per_page=20`,
    qiitaFetcher
  )

  return (
    <>
      <h1>Qiita API Demo</h1>

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
        <h2>Qiita API - Public Items</h2>
        {publicItemsLoading && <p>Loading public items...</p>}
        {publicItemsError && <p style={{ color: 'red' }}>Error: {publicItemsError.message}</p>}
        {publicItems && (
          <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            {publicItems.slice(0, 10).map((item) => (
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
    </>
  )
}

export default App
