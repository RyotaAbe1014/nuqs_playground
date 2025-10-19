import { useState } from 'react'
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
  // Query parameters state
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [query, setQuery] = useState('')

  // Qiita API demo
  const {
    data: qiitaUser,
    error: qiitaError,
    isLoading: qiitaLoading
  } = useSWR<QiitaUser>(
    qiitaEndpoints.authenticatedUser,
    qiitaFetcher
  )

  // Build query string
  const buildQueryString = () => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', perPage.toString())
    if (query.trim()) {
      params.append('query', query.trim())
    }
    return params.toString()
  }

  // Qiita public items
  const {
    data: publicItems,
    error: publicItemsError,
    isLoading: publicItemsLoading
  } = useSWR<QiitaItem[]>(
    `${qiitaEndpoints.items}?${buildQueryString()}`,
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

        <div style={{ marginBottom: '20px', textAlign: 'left', maxWidth: '600px', margin: '0 auto 20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'inline-block', width: '100px' }}>
              Query:
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. tag:React, user:username"
              style={{ width: '400px', padding: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'inline-block', width: '100px' }}>
              Page:
            </label>
            <input
              type="number"
              value={page}
              onChange={(e) => setPage(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              style={{ width: '100px', padding: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'inline-block', width: '100px' }}>
              Per Page:
            </label>
            <input
              type="number"
              value={perPage}
              onChange={(e) => setPerPage(Math.min(100, Math.max(1, parseInt(e.target.value) || 20)))}
              min="1"
              max="100"
              style={{ width: '100px', padding: '5px' }}
            />
          </div>

          <div style={{ fontSize: '0.9em', color: '#888', marginTop: '10px' }}>
            <strong>Query examples:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li>tag:React - Search by tag</li>
              <li>user:username - Search by user</li>
              <li>title:keyword - Search in title</li>
              <li>body:keyword - Search in body</li>
            </ul>
          </div>
        </div>

        {publicItemsLoading && <p>Loading public items...</p>}
        {publicItemsError && <p style={{ color: 'red' }}>Error: {publicItemsError.message}</p>}
        {publicItems && (
          <>
            <p style={{ color: '#666' }}>Showing {publicItems.length} items (Page {page})</p>
            <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
              {publicItems.map((item) => (
                <li key={item.id} style={{ marginBottom: '15px' }}>
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

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{ marginRight: '10px', padding: '5px 15px' }}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                style={{ padding: '5px 15px' }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
