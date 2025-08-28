// context/auth-context.tsx
'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type AuthContextType = {
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Use useCallback to memoize the setToken function
  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
    setTokenState(newToken)
  }, [])

  // Add logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setTokenState(null)
    router.push('/auth')
  }, [router])

  useEffect(() => {
    // Initialize token from localStorage
    const storedToken = localStorage.getItem('token')
    setTokenState(storedToken)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) return

    const isAuthPage = pathname.startsWith('/auth')
    const isPublicPage = pathname === '/' || pathname === '/about' // Add other public pages

    if (!token && !isAuthPage && !isPublicPage) {
      router.push('/auth')
      return
    }

    if (token && isAuthPage) {
      router.push('/dashboard')
      return
    }

    // Handle root path
    if (pathname === '/') {
      router.push(token ? '/dashboard' : '/auth')
    }
  }, [token, pathname, isLoading, router])

  return (
    <AuthContext.Provider value={{
      token,
      setToken,
      logout, // Export logout function
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
