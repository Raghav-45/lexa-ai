'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  updatedAt: number // Timestamp
}

interface ChatHistoryContextType {
  sessions: ChatSession[]
  currentSessionId: string | null
  setCurrentSessionId: (id: string | null) => void
  createNewSession: () => string
  addMessageToSession: (sessionId: string, message: Message) => void
  deleteSession: (sessionId: string) => void
  clearHistory: () => void
  isLoaded: boolean
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined)

const STORAGE_KEY = 'chat_history'
const RETENTION_DAYS = 7

export function ChatHistoryProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load history from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed: ChatSession[] = JSON.parse(stored)
        // Filter out sessions older than RETENTION_DAYS
        const now = Date.now()
        const retentionPeriod = RETENTION_DAYS * 24 * 60 * 60 * 1000
        const validSessions = parsed.filter(
          (session) => now - session.updatedAt < retentionPeriod
        )
        // Sort by most recent
        validSessions.sort((a, b) => b.updatedAt - a.updatedAt)
        setSessions(validSessions)
        
        // If we cleaned up sessions, save the cleaned list back
        if (validSessions.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(validSessions))
        }
      } catch (e) {
        console.error('Failed to parse chat history', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to local storage whenever sessions change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    }
  }, [sessions, isLoaded])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    return newSession.id
  }

  const addMessageToSession = (sessionId: string, message: Message) => {
    setSessions((prev) => {
      return prev.map((session) => {
        if (session.id === sessionId) {
          const updatedMessages = [...session.messages, message]
          
          // Generate a title if it's the first user message
          let newTitle = session.title
          if (session.messages.length === 0 && message.role === 'user') {
            newTitle = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
          }

          return {
            ...session,
            messages: updatedMessages,
            title: newTitle,
            updatedAt: Date.now(),
          }
        }
        return session
      }).sort((a, b) => b.updatedAt - a.updatedAt)
    })
  }

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null)
    }
  }

  const clearHistory = () => {
    setSessions([])
    setCurrentSessionId(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <ChatHistoryContext.Provider
      value={{
        sessions,
        currentSessionId,
        setCurrentSessionId,
        createNewSession,
        addMessageToSession,
        deleteSession,
        clearHistory,
        isLoaded,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  )
}

export function useChatHistory() {
  const context = useContext(ChatHistoryContext)
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider')
  }
  return context
}
