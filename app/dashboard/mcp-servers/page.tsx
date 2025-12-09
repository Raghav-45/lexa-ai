'use client'

import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { McpServerCard } from '@/components/mcp-server-card'
import { AddMcpSheet } from '@/components/add-mcp-sheet'

export default function McpServersPage() {
  const [isAddMcpOpen, setIsAddMcpOpen] = useState(false)
  const mcpServers = [
    {
      name: 'Alpaca',
      description:
        "Agent for stock trading, portfolio management, and market data through Alpaca's trading API",
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/alpaca.png',
      badge: 'Variables',
    },
    // Add more servers as needed
  ]

  return (
    <div className="w-full px-4 md:px-10 py-10 lg:px-32 lg:py-16">
      <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-between lg:items-center mb-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          MCP Servers
        </h1>
        <div className="w-full lg:w-auto flex gap-2 items-center flex-wrap md:flex-nowrap">
          <div className="relative flex-1 min-w-0 md:max-w-[360px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 pr-4 w-full h-10 text-xs text-foreground placeholder:text-muted-foreground bg-popover border-border rounded-lg focus:ring-primary/20 transition-all duration-200"
              placeholder="Search"
            />
          </div>
          <Button 
            className="h-10 px-4 rounded-lg shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
            onClick={() => setIsAddMcpOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add MCP
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
        {mcpServers.map((server) => (
          <McpServerCard
            key={server.name}
            name={server.name}
            description={server.description}
            image={server.image}
            badge={server.badge}
          />
        ))}
      </div>

      <AddMcpSheet open={isAddMcpOpen} onOpenChange={setIsAddMcpOpen} />
    </div>
  )
}
