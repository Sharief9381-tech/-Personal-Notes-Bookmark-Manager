import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const notesAPI = {
  getAll: (params) => axios.get(`${API_URL}/notes`, { headers: getAuthHeader(), params }),
  getOne: (id) => axios.get(`${API_URL}/notes/${id}`, { headers: getAuthHeader() }),
  create: (data) => axios.post(`${API_URL}/notes`, data, { headers: getAuthHeader() }),
  update: (id, data) => axios.put(`${API_URL}/notes/${id}`, data, { headers: getAuthHeader() }),
  delete: (id) => axios.delete(`${API_URL}/notes/${id}`, { headers: getAuthHeader() })
}

export const bookmarksAPI = {
  getAll: (params) => axios.get(`${API_URL}/bookmarks`, { headers: getAuthHeader(), params }),
  getOne: (id) => axios.get(`${API_URL}/bookmarks/${id}`, { headers: getAuthHeader() }),
  create: (data) => axios.post(`${API_URL}/bookmarks`, data, { headers: getAuthHeader() }),
  update: (id, data) => axios.put(`${API_URL}/bookmarks/${id}`, data, { headers: getAuthHeader() }),
  delete: (id) => axios.delete(`${API_URL}/bookmarks/${id}`, { headers: getAuthHeader() })
}
