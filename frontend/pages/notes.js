import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { notesAPI } from '../lib/api'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', tags: '', isFavorite: false })
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchNotes()
    }
  }, [user, loading, router])

  const fetchNotes = async () => {
    try {
      const params = {}
      if (search) params.q = search
      if (tags) params.tags = tags
      const res = await notesAPI.getAll(params)
      setNotes(res.data)
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
      
      if (editingNote) {
        await notesAPI.update(editingNote._id, data)
      } else {
        await notesAPI.create(data)
      }
      
      setFormData({ title: '', content: '', tags: '', isFavorite: false })
      setEditingNote(null)
      setShowForm(false)
      fetchNotes()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      isFavorite: note.isFavorite
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this note?')) {
      await notesAPI.delete(id)
      fetchNotes()
    }
  }

  const toggleFavorite = async (note) => {
    await notesAPI.update(note._id, { ...note, isFavorite: !note.isFavorite })
    fetchNotes()
  }

  if (loading) return <div>Loading...</div>

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notes</h1>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingNote(null)
              setFormData({ title: '', content: '', tags: '', isFavorite: false })
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'New Note'}
          </button>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search notes..."
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
          <button onClick={fetchNotes} className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700">
            Search
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <textarea
              placeholder="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-32"
              required
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
              {editingNote ? 'Update' : 'Create'}
            </button>
          </form>
        )}

        <div className="grid gap-4">
          {notes.map(note => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{note.title}</h3>
                    {note.isFavorite && <span className="text-yellow-500">★</span>}
                  </div>
                  <p className="text-gray-600 mt-2">{note.content}</p>
                  {note.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {note.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleFavorite(note)} className="text-gray-600 hover:text-yellow-500">
                    {note.isFavorite ? '★' : '☆'}
                  </button>
                  <button onClick={() => handleEdit(note)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note._id)} className="text-red-600 hover:underline">
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
