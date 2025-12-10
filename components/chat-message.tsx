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
  isAnimating?: boolean
}

export function ChatMessage({ role, content, index, isAnimating = false }: ChatMessageProps) {
  const isAssistant = role === 'assistant'

  return (
    <motion.div
      initial={isAnimating ? false : { opacity: 0, y: 20, scale: 0.95 }}
      animate={isAnimating ? false : { opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'flex gap-3 px-4 py-3',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      <motion.div
        initial={isAnimating ? false : { opacity: 0 }}
        animate={isAnimating ? false : { opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        className={cn(
          'max-w-[75%] rounded-3xl px-4 py-2.5 shadow-sm',
          isAssistant
            ? 'bg-muted text-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          style={{
            color: 'inherit'
          }}
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
                  <code className={cn(
                    "px-1.5 py-0.5 rounded-md text-xs font-mono",
                    isAssistant ? "bg-background/50" : "bg-primary-foreground/20"
                  )} {...props}>
                    {children}
                  </code>
                )
              },
              // Customize links
              a: ({ node, children, ...props }: any) => (
                <a
                  {...props}
                  className={cn(
                    "underline underline-offset-2 hover:no-underline",
                    isAssistant ? "text-primary" : "text-primary-foreground"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              // Customize lists
              ul: ({ node, children, ...props }: any) => (
                <ul className="list-disc list-inside space-y-0.5 my-2" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ node, children, ...props }: any) => (
                <ol className="list-decimal list-inside space-y-0.5 my-2" {...props}>
                  {children}
                </ol>
              ),
              // Customize headings
              h1: ({ node, children, ...props }: any) => (
                <h1 className="text-lg font-semibold mt-3 mb-1" {...props}>
                  {children}
                </h1>
              ),
              h2: ({ node, children, ...props }: any) => (
                <h2 className="text-base font-semibold mt-2 mb-1" {...props}>
                  {children}
                </h2>
              ),
              // Customize paragraphs
              p: ({ node, children, ...props }: any) => (
                <p className="mb-0" {...props}>
                  {children}
                </p>
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
        </div>
      </motion.div>
    </motion.div>
  )
}
