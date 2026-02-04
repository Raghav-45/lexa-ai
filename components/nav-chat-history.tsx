'use client'

import { Folder, Forward, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useChatHistory } from '@/components/chat-history-provider'

export function NavChatHistory() {
  const { isMobile } = useSidebar()
  const { sessions, currentSessionId, setCurrentSessionId, deleteSession } = useChatHistory()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chat History</SidebarGroupLabel>
      <SidebarMenu>
        {sessions.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton 
              asChild 
              isActive={item.id === currentSessionId}
              onClick={() => setCurrentSessionId(item.id)}
            >
              <button className="text-left">
                <span>{item.title}</span>
              </button>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem onClick={() => setCurrentSessionId(item.id)}>
                   <Folder className="text-muted-foreground" />
                   <span>View Chat</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteSession(item.id)}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
