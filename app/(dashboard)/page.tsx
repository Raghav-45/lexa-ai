'use client'

import { AiPrompt } from '@/components/AiPrompt'
import { ChatMessage } from '@/components/chat-message'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface TravelingBubble {
  id: string
  content: string
  startX: number
  startY: number
  endX: number
  endY: number
  width: number
  height: number
  endWidth?: number
  endHeight?: number
}

// Animation configuration - adjust these values to change animation behavior
const ANIMATION_CONFIG = {
  // Duration of the bubble travel animation in seconds
  travelDuration: 0.4,
  // Easing function for smooth animation
  easing: [0.4, 0, 0.2, 1] as const,
  // When to start fading out (0-1, where 1 is end of animation)
  fadeStartPoint: 0.7,
  // Delay before showing the actual message (in ms)
  messageRevealDelay: 400,
  // Total time before removing bubble from DOM (in ms)
  bubbleCleanupDelay: 400,
  // Border radius values
  borderRadius: {
    start: '28px',
    end: '24px',
  },
} as const

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash')
  const [travelingBubbles, setTravelingBubbles] = useState<TravelingBubble[]>(
    []
  )
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(
    null
  )
  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const hasMessages = messages.length > 0

  useEffect(() => {
    // Fetch available models on mount
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/list-models')
        const data = await response.json()
        if (data.models && data.models.length > 0) {
          setAvailableModels(data.models)
          // data.models.filter((model: string) => model.endsWith('-flash-lite'))[0]
          setSelectedModel(
            data.models.filter((model: string) =>
              model.endsWith('gemini-2.5-flash-lite')
            )[0] || data.models[0]
          ) // Set first model as default
          // setSelectedModel(data.models.filter((model: string) => model.endsWith('gemini-2.5-flash-lite'))[0]) // Set first model as default
        }
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    }
    fetchModels()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    }

    // Add message first (will be hidden during animation)
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setAnimatingMessageId(userMessage.id)

    // Wait for DOM to update, then capture positions
    await new Promise((resolve) => setTimeout(resolve, 0))

    const promptRect = promptRef.current?.getBoundingClientRect()
    const lastMessageElement = lastMessageRef.current

    if (promptRect && lastMessageElement) {
      // Find the actual message bubble (the motion.div with bg-primary)
      const messageBubble = lastMessageElement.querySelector('.bg-primary')
      const bubbleRect = messageBubble?.getBoundingClientRect()

      if (bubbleRect) {
        const bubble: TravelingBubble = {
          id: userMessage.id,
          content,
          startX: promptRect.left,
          startY: promptRect.top,
          endX: bubbleRect.left,
          endY: bubbleRect.top,
          width: promptRect.width,
          height: promptRect.height,
          endWidth: bubbleRect.width,
          endHeight: bubbleRect.height,
        }

        setTravelingBubbles((prev) => [...prev, bubble])

        // Show message when bubble reaches destination
        setTimeout(() => {
          setAnimatingMessageId(null)
        }, ANIMATION_CONFIG.messageRevealDelay)

        // Remove bubble after animation completes
        setTimeout(() => {
          setTravelingBubbles((prev) => prev.filter((b) => b.id !== bubble.id))
        }, ANIMATION_CONFIG.bubbleCleanupDelay)
      }
    }

    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, aiMessage])
      setIsAiStreaming(true)
    }, 100)

    try {
      const response = await fetch('/api/chat/without-langchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch AI response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body is not readable')
      }

      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          setIsAiStreaming(false)
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                accumulatedContent += parsed.text
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                )
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching AI response:', error)
      setIsAiStreaming(false)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: 'Sorry, there was an error processing your request.',
              }
            : msg
        )
      )
    }
  }

  return (
    <>
      {/* Traveling Bubbles Overlay */}
      <AnimatePresence>
        {travelingBubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            layoutId={`bubble-${bubble.id}`}
            initial={{
              position: 'fixed',
              left: bubble.startX,
              top: bubble.startY,
              width: bubble.width,
              height: bubble.height,
              opacity: 1,
              scale: 1,
              borderRadius: ANIMATION_CONFIG.borderRadius.start,
            }}
            animate={{
              left: bubble.endX,
              top: bubble.endY,
              width: bubble.endWidth || bubble.width,
              height: bubble.endHeight || bubble.height,
              borderRadius: ANIMATION_CONFIG.borderRadius.end,
            }}
            transition={{
              duration: ANIMATION_CONFIG.travelDuration,
              ease: ANIMATION_CONFIG.easing,
              opacity: {
                times: [0, ANIMATION_CONFIG.fadeStartPoint, 1],
                ease: 'easeOut',
              },
            }}
            className="pointer-events-none z-50 bg-primary text-primary-foreground shadow-2xl flex items-center px-4"
          >
            <p className="text-sm truncate">{bubble.content}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Conversations</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>New Chat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedModel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-96 overflow-y-auto"
            >
              {availableModels.map((model) => (
                <DropdownMenuItem
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={selectedModel === model ? 'bg-accent' : ''}
                >
                  {model}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <motion.div
        className="flex flex-col transition-all max-w-2xl mx-auto w-full"
        initial={{ height: 'calc(100vh - calc(var(--spacing) * 16 * 3))' }}
        animate={{
          height: hasMessages
            ? 'calc(100vh - calc(var(--spacing) * 16 * 1 + 50px))'
            : 'calc(100vh - calc(var(--spacing) * 16 * 3))',
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          ref={messagesContainerRef}
          className="flex flex-col flex-1 overflow-hidden"
          animate={{
            flexGrow: hasMessages ? 1 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatePresence mode="wait">
            {hasMessages && (
              <ScrollArea key="messages" className="h-full">
                <div ref={scrollRef} className="flex flex-col">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      ref={
                        index === messages.length - 1 ? lastMessageRef : null
                      }
                      className={
                        message.id === animatingMessageId
                          ? 'opacity-0 pointer-events-none'
                          : ''
                      }
                    >
                      <ChatMessage
                        role={message.role}
                        content={message.content}
                        index={index}
                        isAnimating={message.id === animatingMessageId}
                        isLastMessage={index === messages.length - 1}
                        showActions={index === messages.length - 1 && !isAiStreaming}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {!hasMessages && (
            <motion.h1
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-7 mx-auto text-center text-2xl font-semibold leading-9 text-foreground px-1 text-pretty whitespace-pre-wrap"
            >
              How can I help you today?
            </motion.h1>
          )}
        </AnimatePresence>
        <motion.div
          ref={promptRef}
          animate={{
            y: hasMessages ? 0 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AiPrompt onSend={handleSendMessage} hasMessages={hasMessages} />
        </motion.div>
        <motion.div
          className="flex"
          style={{ willChange: 'flex-grow' }}
          initial={{ flexGrow: 1 }}
          animate={{ flexGrow: hasMessages ? 0 : 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>
    </>
  )
}
