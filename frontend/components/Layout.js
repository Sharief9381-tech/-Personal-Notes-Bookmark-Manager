import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link href="/notes" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                Notes
              </Link>
              <Link href="/bookmarks" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                Bookmarks
              </Link>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.name}</span>
                <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
