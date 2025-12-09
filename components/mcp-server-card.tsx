import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import Image from 'next/image'

interface McpServerCardProps {
  name: string
  description: string
  image: string
  badge?: string
}

export function McpServerCard({
  name,
  description,
  image,
  badge,
}: McpServerCardProps) {
  return (
    <div className="w-full h-full">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full">
        <div className="px-6 w-full h-full">
          <div className="flex flex-col gap-3 h-full">
            <div className="flex items-start gap-3 w-full">
              <Avatar className="h-10 w-10 rounded-lg">
                <Image
                  alt={name}
                  src={image}
                  width={40}
                  height={40}
                  className="object-cover rounded-lg"
                />
              </Avatar>
              <div className="flex items-start justify-between w-full min-w-0">
                <div className="flex flex-col min-w-0 flex-1">
                  <h3 className="font-medium text-base text-foreground truncate">
                    {name}
                  </h3>
                  {badge && (
                    <div className="flex gap-1 items-center mt-1 min-w-0">
                      <span className="inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap shrink-0 transition-colors overflow-hidden bg-blue-500/20 text-blue-400 border-0 text-xs px-2 py-0.5 w-fit max-w-full truncate">
                        {badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <p className="text-muted-foreground text-sm leading-relaxed h-10 overflow-hidden line-clamp-2">
                {description}
              </p>
            </div>
            <div className="flex w-full items-center justify-between">
              <Button size="sm" className="gap-1.5 rounded-lg h-8 px-3">
                <Settings className="h-4 w-4" />
                <span className="text-xs font-semibold">Configure</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
