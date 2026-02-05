import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      router.push(user ? '/notes' : '/login')
    }
  }, [user, loading, router])

  return <div className="flex items-center justify-center min-h-screen">Loading...</div>
}
