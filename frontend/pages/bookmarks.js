import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { bookmarksAPI } from '../lib/api'

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState(null)
  const [formData, setFormData] = useState({ url: '', title: '', description: '', tags: '', isFavorite: false })
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchBookmarks()
    }
  }, [user, loading, router])

  const fetchBookmarks = async () => {
    try {
      const params = {}
      if (search) params.q = search
      if (tags) params.tags = tags
      const res = await bookmarksAPI.getAll(params)
      setBookmarks(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      }
      
      if (editingBookmark) {
        await bookmarksAPI.update(editingBookmark._id, data)
      } else {
        await bookmarksAPI.create(data)
      }
      
      setFormData({ url: '', title: '', description: '', tags: '', isFavorite: false })
      setEditingBookmark(null)
      setShowForm(false)
      fetchBookmarks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark)
    setFormData({
      url: bookmark.url,
      title: bookmark.title,
      description: bookmark.description,
      tags: bookmark.tags.join(', '),
      isFavorite: bookmark.isFavorite
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this bookmark?')) {
      await bookmarksAPI.delete(id)
      fetchBookmarks()
    }
  }

  const toggleFavorite = async (bookmark) => {
    await bookmarksAPI.update(bookmark._id, { ...bookmark, isFavorite: !bookmark.isFavorite })
    fetchBookmarks()
  }

  if (loading) return <div>Loading...</div>

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Bookmarks</h1>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingBookmark(null)
              setFormData({ url: '', title: '', description: '', tags: '', isFavorite: false })
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'New Bookmark'}
          </button>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Filter by tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <button onClick={fetchBookmarks} className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700">
            Search
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
            <input
              type="url"
              placeholder="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Title (leave empty to auto-fetch)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-24"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Mark as favorite</span>
            </label>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              {editingBookmark ? 'Update' : 'Create'}
            </button>
          </form>
        )}

        <div className="grid gap-4">
          {bookmarks.map(bookmark => (
            <div key={bookmark._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{bookmark.title}</h3>
                    {bookmark.isFavorite && <span className="text-yellow-500">★</span>}
                  </div>
                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    {bookmark.url}
                  </a>
                  {bookmark.description && <p className="text-gray-600 mt-2">{bookmark.description}</p>}
                  {bookmark.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {bookmark.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleFavorite(bookmark)} className="text-gray-600 hover:text-yellow-500">
                    {bookmark.isFavorite ? '★' : '☆'}
                  </button>
                  <button onClick={() => handleEdit(bookmark)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(bookmark._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
