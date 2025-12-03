'use client'

import { AppSidebar } from '@/components/app-sidebar'
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
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasMessages = messages.length > 0

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'This is a simulated AI response. Connect your actual AI service here.',
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
                      <ChatMessage
                        key={message.id}
                        role={message.role}
                        content={message.content}
                        index={index}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            animate={{
              y: hasMessages ? 0 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <AiPrompt onSend={handleSendMessage} />
          </motion.div>
          <motion.div
            className="flex"
            style={{ willChange: 'flex-grow' }}
            initial={{ flexGrow: 1 }}
            animate={{ flexGrow: hasMessages ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  )
}
