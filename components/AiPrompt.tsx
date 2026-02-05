
import { AnimatePresence, motion } from "framer-motion";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  IconMicrophone,
  IconPaperclip,
  IconPlus,
  IconSearch,
  IconSend,
  IconSparkles,
  IconWaveSine,
} from "@tabler/icons-react";
import { useRef, useState } from "react";

interface AiPromptProps {
  onSend?: (message: string) => void;
  hasMessages?: boolean;
}

export function AiPrompt({ onSend, hasMessages = false }: AiPromptProps) {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      setMessage("");
      setIsExpanded(false);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      if (onSend) {
        onSend(message.trim());
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    setIsExpanded(e.target.value.length > 100 || e.target.value.includes("\n"));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="group/composer w-full">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => {}}
        />

        <div
          className={cn(
            "w-full mx-auto bg-transparent dark:bg-muted/50 cursor-text overflow-clip bg-clip-padding p-2.5 shadow-lg border border-border transition-all duration-200",
            {
              "rounded-3xl grid grid-cols-1 grid-rows-[auto_1fr_auto]":
                isExpanded,
              "rounded-[28px] grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto]":
                !isExpanded,
            }
          )}
          style={{
            gridTemplateAreas: isExpanded
              ? "'header' 'primary' 'footer'"
              : "'header header header' 'leading primary trailing' '. footer .'",
          }}
        >
          <div
            className={cn(
              "flex min-h-14 items-center overflow-x-hidden px-1.5",
              {
                "px-2 py-1 mb-0": isExpanded,
                "-my-2.5": !isExpanded,
              }
            )}
            style={{ gridArea: "primary" }}
          >
            <div className="flex-1 overflow-auto max-h-52">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={hasMessages ? "Ask another question..." : "Ask anything..."}
                className="min-h-0 resize-none rounded-none border-0 p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-thin dark:bg-transparent"
                rows={1}
              />
            </div>
          </div>

          <div
            className={cn("flex", { hidden: isExpanded })}
            style={{ gridArea: "leading" }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-accent outline-none ring-0"
                >
                  <IconPlus className="size-6 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="max-w-xs rounded-2xl p-1.5"
              >
                <DropdownMenuGroup className="space-y-1">
                  <DropdownMenuItem
                    className="rounded-[calc(1rem-6px)]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <IconPaperclip size={20} className="opacity-60" />
                    Add photos & files
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-[calc(1rem-6px)]"
                    onClick={() => {}}
                  >
                    <div className="flex items-center gap-2">
                      <IconSparkles size={20} className="opacity-60" />
                      Agent mode
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-[calc(1rem-6px)]"
                    onClick={() => {}}
                  >
                    <IconSearch size={20} className="opacity-60" />
                    Deep Research
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div
            className="flex items-center gap-2"
            style={{ gridArea: isExpanded ? "footer" : "trailing" }}
          >
            <div className="ms-auto flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-accent"
              >
                <IconMicrophone className="size-5 text-muted-foreground" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-accent relative ml-1.5"
              >
                <IconWaveSine className="size-5 text-muted-foreground" />
              </Button>

              <AnimatePresence>
                {message.trim() && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, width: 0, marginLeft: 0 }}
                    animate={{ opacity: 1, scale: 1, width: "auto", marginLeft: "0.375rem" }}
                    exit={{ opacity: 0, scale: 0, width: 0, marginLeft: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      mass: 0.5
                    }}
                    className="flex items-center whitespace-nowrap" 
                  >
                    <Button
                      type="submit"
                      size="icon"
                      className="h-9 w-9 rounded-full shrink-0"
                    >
                      <IconSend className="size-5" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}