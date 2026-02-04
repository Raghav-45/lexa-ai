import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider
} from '@/components/ui/sidebar'
import { ChatHistoryProvider } from '@/components/chat-history-provider'

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <ChatHistoryProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ChatHistoryProvider>
  )
}