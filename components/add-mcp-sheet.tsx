'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Paperclip, Plus } from 'lucide-react'
import { useState } from 'react'

interface AddMcpSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMcpSheet({ open, onOpenChange }: AddMcpSheetProps) {
  const [fileName, setFileName] = useState('No logo chosen')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-2xl overflow-y-auto"
        hideCloseButton={true}
      >
        <div className="container px-8 py-16 mx-auto w-full h-full flex flex-col items-center md:items-start gap-6 md:gap-8">
          <div className="flex flex-row justify-between items-start gap-4 w-full">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
            </Button>
          </div>

          <div className="w-full space-y-2">
            <h1 className="text-xl md:text-2xl lg:text-[30px] leading-9 font-heading font-semibold text-foreground w-full">
              Add MCP
            </h1>
            <p className="text-sm text-muted-foreground">
              This will add a new MCP agent to your account. You can then use
              this MCP agent in your workflows.
            </p>
          </div>

          <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="agentName"
                  className="flex items-center gap-2 text-sm leading-none font-medium"
                >
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="agentName"
                  placeholder="Enter name"
                  className="h-10 rounded-[10px]"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm leading-none font-medium">
                  Upload logo <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-3 h-10 bg-muted rounded-[10px] border border-border px-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 rounded-md"
                    type="button"
                    onClick={() =>
                      document.getElementById('logo-upload')?.click()
                    }
                  >
                    <Paperclip className="h-3 w-3 mr-1" />
                    Choose file
                  </Button>
                  <span className="text-xs text-muted-foreground flex-1">
                    {fileName}
                  </span>
                  <input
                    id="logo-upload"
                    accept="image/*"
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="flex items-center gap-2 text-sm leading-none font-medium"
              >
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Write your MCP description here..."
                className="min-h-[120px] rounded-[10px]"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1 space-y-2">
                <label
                  htmlFor="endpoint"
                  className="flex items-center gap-2 text-sm leading-none font-medium"
                >
                  MCP Endpoint <span className="text-destructive">*</span>
                </label>
                <Input
                  id="endpoint"
                  placeholder="https://your-mcp-server.com/mcp"
                  className="h-10 rounded-[10px] w-full"
                />
              </div>
              <Button
                variant="secondary"
                className="h-10 rounded-[10px]"
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Header
              </Button>
            </div>

            <div className="h-px w-full bg-border"></div>

            <div className="flex items-center gap-3">
              <Button className="h-10 rounded-[10px]">
                Save &amp; Test Connection
              </Button>
              <Button
                variant="ghost"
                className="h-10 rounded-[10px]"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
