'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  index: number
}

export function ChatMessage({ role, content, index }: ChatMessageProps) {
  const isAssistant = role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'flex gap-3 px-4 py-6 transition-colors hover:bg-muted/50',
        isAssistant ? 'bg-muted/20' : ''
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          isAssistant 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground'
        )}>
          {isAssistant ? 'AI' : 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
          className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              // Customize code blocks
              code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="bg-muted px-1 py-0.5 rounded text-xs" {...props}>
                    {children}
                  </code>
                )
              },
              // Customize links
              a: ({ node, children, ...props }: any) => (
                <a
                  {...props}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              // Customize lists
              ul: ({ node, children, ...props }: any) => (
                <ul className="list-disc list-inside space-y-1" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ node, children, ...props }: any) => (
                <ol className="list-decimal list-inside space-y-1" {...props}>
                  {children}
                </ol>
              ),
              // Customize headings
              h1: ({ node, children, ...props }: any) => (
                <h1 className="text-xl font-bold mt-4 mb-2" {...props}>
                  {children}
                </h1>
              ),
              h2: ({ node, children, ...props }: any) => (
                <h2 className="text-lg font-bold mt-3 mb-2" {...props}>
                  {children}
                </h2>
              ),
              h3: ({ node, children, ...props }: any) => (
                <h3 className="text-base font-bold mt-2 mb-1" {...props}>
                  {children}
                </h3>
              ),
              // Customize paragraphs
              p: ({ node, children, ...props }: any) => (
                <p className="mb-2 last:mb-0" {...props}>
                  {children}
                </p>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </motion.div>
      </div>
    </motion.div>
  )
}
