'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { ThumbsUp, ThumbsDown, Copy, Image as ImageIcon, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  index: number
  isAnimating?: boolean
  isLastMessage?: boolean
  showActions?: boolean
}

export function ChatMessage({ role, content, index, isAnimating = false, isLastMessage = false, showActions = false }: ChatMessageProps) {
  const isAssistant = role === 'assistant'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        'flex flex-col gap-2 px-4 py-3',
        isAssistant ? 'items-start' : 'items-end'
      )}
    >
      <motion.div
        initial={isAnimating ? false : { opacity: 0 }}
        animate={isAnimating ? false : { opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        className={cn(
          'max-w-[75%] shadow-sm',
          isAssistant
            ? 'text-white pt-2.5 px-1'
            : 'bg-primary text-primary-foreground rounded-3xl px-3.5 py-2'
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
              // p: ({ node, children, ...props }: any) => (
              //   <p className="mb-2 last:mb-0" {...props}>
              //     {children}
              //   </p>
              // ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </motion.div>
      
      {isAssistant && showActions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="flex items-center gap-1"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => {}}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => {}}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => {}}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => {}}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Personalized with Memory</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
